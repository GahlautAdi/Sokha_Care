package com.sokhacare.modules.doctoravailability.service;

import com.sokhacare.common.exceptions.ConflictException;
import com.sokhacare.common.exceptions.ResourceNotFoundException;
import com.sokhacare.common.exceptions.UnauthorizedException;
import com.sokhacare.common.security.SecurityUtils;
import com.sokhacare.modules.doctoravailability.dto.DoctorAvailabilityRequest;
import com.sokhacare.modules.doctoravailability.dto.DoctorAvailabilityResponse;
import com.sokhacare.modules.doctoravailability.entity.DoctorAvailability;
import com.sokhacare.modules.doctoravailability.entity.DayOfWeek;
import com.sokhacare.modules.doctoravailability.repository.DoctorAvailabilityRepository;
import com.sokhacare.modules.doctorverification.entity.DoctorVerification;
import com.sokhacare.modules.doctorverification.entity.DoctorVerificationStatus;
import com.sokhacare.modules.doctorverification.repository.DoctorVerificationRepository;
import com.sokhacare.modules.profile.entity.Doctor;
import com.sokhacare.modules.profile.repository.DoctorRepository;
import com.sokhacare.modules.users.entity.Role;
import com.sokhacare.modules.users.entity.User;
import com.sokhacare.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository doctorAvailabilityRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorVerificationRepository doctorVerificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public DoctorAvailabilityResponse create(DoctorAvailabilityRequest request) {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        Doctor doctor = requireDoctorProfile(user.getId());
        ensureApprovedDoctor(doctor.getId());

        validateTimeRange(request.startTime(), request.endTime());
        ensureNoOverlap(doctor.getId(), request.dayOfWeek(), request.startTime(), request.endTime(), null);

        DoctorAvailability availability = DoctorAvailability.builder()
                .doctorId(doctor.getId())
                .dayOfWeek(request.dayOfWeek())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .consultationMode(request.consultationMode())
                .active(true)
                .build();

        return toResponse(doctorAvailabilityRepository.save(availability));
    }

    @Transactional
    public DoctorAvailabilityResponse update(UUID id, DoctorAvailabilityRequest request) {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        Doctor doctor = requireDoctorProfile(user.getId());
        ensureApprovedDoctor(doctor.getId());

        DoctorAvailability availability = requireOwnedAvailability(id, doctor.getId());
        validateTimeRange(request.startTime(), request.endTime());
        if (availability.isActive()) {
            ensureNoOverlap(doctor.getId(), request.dayOfWeek(), request.startTime(), request.endTime(), id);
        }

        availability.setDayOfWeek(request.dayOfWeek());
        availability.setStartTime(request.startTime());
        availability.setEndTime(request.endTime());
        availability.setConsultationMode(request.consultationMode());

        return toResponse(doctorAvailabilityRepository.save(availability));
    }

    @Transactional
    public DoctorAvailabilityResponse delete(UUID id) {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        Doctor doctor = requireDoctorProfile(user.getId());
        ensureApprovedDoctor(doctor.getId());

        DoctorAvailability availability = requireOwnedAvailability(id, doctor.getId());
        if (!availability.isActive()) {
            throw new ConflictException("Availability is already inactive");
        }

        availability.setActive(false);
        return toResponse(doctorAvailabilityRepository.save(availability));
    }

    @Transactional(readOnly = true)
    public List<DoctorAvailabilityResponse> getMyAvailability() {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        Doctor doctor = requireDoctorProfile(user.getId());

        return doctorAvailabilityRepository.findAllByDoctorId(doctor.getId())
                .stream()
                .sorted(availabilityComparator())
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DoctorAvailabilityResponse> getDoctorAvailability(UUID doctorId) {
        requireDoctorProfileById(doctorId);
        return doctorAvailabilityRepository.findAllByDoctorIdAndActiveTrue(doctorId)
                .stream()
                .sorted(availabilityComparator())
                .map(this::toResponse)
                .toList();
    }

    private User currentUser() {
        UUID userId = SecurityUtils.currentUserId()
                .orElseThrow(() -> new UnauthorizedException("Authenticated user context is required"));
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user context is required"));
    }

    private Doctor requireDoctorProfile(UUID userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    private Doctor requireDoctorProfileById(UUID doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    private void ensureRole(User user, Role role) {
        if (!user.getRoles().contains(role)) {
            throw new AccessDeniedException("You do not have access to this resource");
        }
    }

    private void ensureApprovedDoctor(UUID doctorId) {
        DoctorVerification latestVerification = doctorVerificationRepository
                .findFirstByDoctorIdOrderBySubmittedAtDesc(doctorId)
                .orElse(null);
        if (latestVerification == null || latestVerification.getStatus() != DoctorVerificationStatus.APPROVED) {
            throw new AccessDeniedException("Only approved doctors can manage availability");
        }
    }

    private DoctorAvailability requireOwnedAvailability(UUID id, UUID doctorId) {
        return doctorAvailabilityRepository.findByIdAndDoctorId(id, doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor availability not found"));
    }

    private void validateTimeRange(LocalTime startTime, LocalTime endTime) {
        if (startTime == null || endTime == null || !endTime.isAfter(startTime)) {
            throw new ConflictException("End time must be greater than start time");
        }
    }

    private void ensureNoOverlap(UUID doctorId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, UUID excludeId) {
        boolean overlaps = doctorAvailabilityRepository.findAllByDoctorIdAndActiveTrue(doctorId)
                .stream()
                .filter(availability -> availability.getDayOfWeek() == dayOfWeek)
                .filter(availability -> excludeId == null || !excludeId.equals(availability.getId()))
                .anyMatch(availability -> overlaps(startTime, endTime, availability.getStartTime(), availability.getEndTime()));

        if (overlaps) {
            throw new ConflictException("Availability overlaps with an existing slot");
        }
    }

    private boolean overlaps(LocalTime startTime, LocalTime endTime, LocalTime otherStartTime, LocalTime otherEndTime) {
        return startTime.isBefore(otherEndTime) && endTime.isAfter(otherStartTime);
    }

    private Comparator<DoctorAvailability> availabilityComparator() {
        return Comparator
                .comparingInt((DoctorAvailability availability) -> availability.getDayOfWeek().ordinal())
                .thenComparing(DoctorAvailability::getStartTime)
                .thenComparing(DoctorAvailability::getEndTime)
                .thenComparing(DoctorAvailability::isActive, Comparator.reverseOrder());
    }

    private DoctorAvailabilityResponse toResponse(DoctorAvailability availability) {
        return new DoctorAvailabilityResponse(
                availability.getId(),
                availability.getDoctorId(),
                availability.getDayOfWeek(),
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getConsultationMode(),
                availability.isActive(),
                availability.getCreatedAt(),
                availability.getUpdatedAt()
        );
    }
}
