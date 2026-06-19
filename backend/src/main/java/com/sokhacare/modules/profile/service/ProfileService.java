package com.sokhacare.modules.profile.service;

import com.sokhacare.common.exceptions.ResourceNotFoundException;
import com.sokhacare.common.exceptions.UnauthorizedException;
import com.sokhacare.common.security.SecurityUtils;
import com.sokhacare.modules.profile.dto.DoctorProfileRequest;
import com.sokhacare.modules.profile.dto.DoctorProfileResponse;
import com.sokhacare.modules.profile.dto.PatientProfileRequest;
import com.sokhacare.modules.profile.dto.PatientProfileResponse;
import com.sokhacare.modules.profile.dto.ProfileOverviewResponse;
import com.sokhacare.modules.profile.entity.Doctor;
import com.sokhacare.modules.profile.entity.Patient;
import com.sokhacare.modules.profile.entity.ConsultationMode;
import com.sokhacare.modules.profile.entity.BloodGroup;
import com.sokhacare.modules.profile.entity.Gender;
import com.sokhacare.modules.profile.repository.DoctorRepository;
import com.sokhacare.modules.profile.repository.PatientRepository;
import com.sokhacare.modules.users.dto.UserResponse;
import com.sokhacare.modules.users.entity.Role;
import com.sokhacare.modules.users.entity.User;
import com.sokhacare.modules.users.mapper.UserMapper;
import com.sokhacare.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public ProfileOverviewResponse getMe() {
        User user = currentUser();
        UserResponse userResponse = userMapper.toResponse(user);
        return new ProfileOverviewResponse(
                userResponse,
                patientRepository.findByUserId(user.getId()).map(this::toPatientResponse).orElse(null),
                doctorRepository.findByUserId(user.getId()).map(this::toDoctorResponse).orElse(null)
        );
    }

    @Transactional(readOnly = true)
    public PatientProfileResponse getPatientProfile() {
        User user = currentUser();
        ensureRole(user, Role.PATIENT);
        return patientRepository.findByUserId(user.getId())
                .map(this::toPatientResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    @Transactional
    public PatientProfileResponse upsertPatientProfile(PatientProfileRequest request) {
        User user = currentUser();
        ensureRole(user, Role.PATIENT);

        Patient profile = patientRepository.findByUserId(user.getId())
                .orElseGet(() -> Patient.builder().userId(user.getId()).build());
        profile.setDateOfBirth(request.dateOfBirth());
        profile.setGender(request.gender());
        profile.setPhoneNumber(request.phoneNumber().trim());
        profile.setBloodGroup(request.bloodGroup());
        profile.setAddress(request.address().trim());
        profile.setEmergencyContactName(request.emergencyContactName().trim());
        profile.setEmergencyContactPhone(request.emergencyContactPhone().trim());
        profile.setAllergySummary(request.allergySummary().trim());

        return toPatientResponse(patientRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public DoctorProfileResponse getDoctorProfile() {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        return doctorRepository.findByUserId(user.getId())
                .map(this::toDoctorResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    @Transactional
    public DoctorProfileResponse upsertDoctorProfile(DoctorProfileRequest request) {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);

        Doctor profile = doctorRepository.findByUserId(user.getId())
                .orElseGet(() -> Doctor.builder().userId(user.getId()).build());
        profile.setSpecialty(request.specialty().trim());
        profile.setConsultationFee(request.consultationFee());
        profile.setBio(request.bio().trim());
        profile.setConsultationMode(request.consultationMode());
        profile.setProfilePhotoUrl(request.profilePhotoUrl() == null || request.profilePhotoUrl().isBlank() ? null : request.profilePhotoUrl().trim());
        profile.setActive(Boolean.TRUE.equals(request.active()));

        return toDoctorResponse(doctorRepository.save(profile));
    }

    private User currentUser() {
        UUID userId = SecurityUtils.currentUserId()
                .orElseThrow(() -> new UnauthorizedException("Authenticated user context is required"));
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user context is required"));
    }

    private void ensureRole(User user, Role role) {
        if (!user.getRoles().contains(role)) {
            throw new AccessDeniedException("You do not have access to this profile");
        }
    }

    private PatientProfileResponse toPatientResponse(Patient profile) {
        return new PatientProfileResponse(
                profile.getId(),
                profile.getUserId(),
                profile.getDateOfBirth(),
                profile.getGender(),
                profile.getPhoneNumber(),
                profile.getBloodGroup(),
                profile.getAddress(),
                profile.getEmergencyContactName(),
                profile.getEmergencyContactPhone(),
                profile.getAllergySummary(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }

    private DoctorProfileResponse toDoctorResponse(Doctor profile) {
        return new DoctorProfileResponse(
                profile.getId(),
                profile.getUserId(),
                profile.getSpecialty(),
                profile.getConsultationFee(),
                profile.getBio(),
                profile.getConsultationMode(),
                profile.getProfilePhotoUrl(),
                profile.isActive(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
