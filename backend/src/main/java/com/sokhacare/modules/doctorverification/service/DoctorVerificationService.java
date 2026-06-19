package com.sokhacare.modules.doctorverification.service;

import com.sokhacare.common.exceptions.ConflictException;
import com.sokhacare.common.exceptions.ResourceNotFoundException;
import com.sokhacare.common.exceptions.UnauthorizedException;
import com.sokhacare.common.security.SecurityUtils;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationReviewRequest;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationStatusResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationSubmitRequest;
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

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorVerificationService {

    private static final List<DoctorVerificationStatus> ACTIVE_STATUSES =
            List.of(DoctorVerificationStatus.PENDING, DoctorVerificationStatus.UNDER_REVIEW);

    private final DoctorVerificationRepository doctorVerificationRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DoctorVerificationStatusResponse getStatus() {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        Doctor doctor = requireDoctorProfile(user.getId());
        DoctorVerification latestVerification = latestVerification(doctor.getId());

        return new DoctorVerificationStatusResponse(
                doctor.getId(),
                true,
                canSubmit(latestVerification),
                toResponse(latestVerification)
        );
    }

    @Transactional
    public DoctorVerificationResponse submit(DoctorVerificationSubmitRequest request) {
        User user = currentUser();
        ensureRole(user, Role.DOCTOR);
        Doctor doctor = requireDoctorProfile(user.getId());

        DoctorVerification latestVerification = latestVerification(doctor.getId());
        if (latestVerification != null && latestVerification.getStatus() == DoctorVerificationStatus.APPROVED) {
            throw new ConflictException("Approved doctors cannot submit another verification request");
        }
        if (latestVerification != null && ACTIVE_STATUSES.contains(latestVerification.getStatus())) {
            throw new ConflictException("You already have an active verification request");
        }

        DoctorVerification verification = DoctorVerification.builder()
                .doctorId(doctor.getId())
                .licenseNumber(request.licenseNumber().trim())
                .medicalCouncil(request.medicalCouncil().trim())
                .documentUrl(request.documentUrl().trim())
                .status(DoctorVerificationStatus.PENDING)
                .submittedAt(Instant.now())
                .build();

        return toResponse(doctorVerificationRepository.save(verification));
    }

    @Transactional(readOnly = true)
    public List<DoctorVerificationResponse> listAll() {
        return doctorVerificationRepository.findAllByOrderBySubmittedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DoctorVerificationResponse getById(UUID id) {
        return toResponse(findVerification(id));
    }

    @Transactional
    public DoctorVerificationResponse approve(UUID id, DoctorVerificationReviewRequest request) {
        return review(id, request, DoctorVerificationStatus.APPROVED);
    }

    @Transactional
    public DoctorVerificationResponse reject(UUID id, DoctorVerificationReviewRequest request) {
        if (request.remarks() == null || request.remarks().isBlank()) {
            throw new ConflictException("Remarks are required when rejecting a verification request");
        }
        return review(id, request, DoctorVerificationStatus.REJECTED);
    }

    private DoctorVerificationResponse review(UUID id, DoctorVerificationReviewRequest request, DoctorVerificationStatus nextStatus) {
        User user = currentUser();
        ensureAdmin(user);

        DoctorVerification verification = findVerification(id);
        if (verification.getStatus() == DoctorVerificationStatus.APPROVED || verification.getStatus() == DoctorVerificationStatus.REJECTED) {
            throw new ConflictException("This verification request has already been reviewed");
        }

        verification.setStatus(nextStatus);
        verification.setReviewedAt(Instant.now());
        verification.setReviewedBy(user.getId());
        if (request.remarks() != null && !request.remarks().isBlank()) {
            verification.setRemarks(request.remarks().trim());
        } else if (nextStatus == DoctorVerificationStatus.APPROVED && verification.getRemarks() == null) {
            verification.setRemarks(null);
        }

        return toResponse(doctorVerificationRepository.save(verification));
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

    private void ensureRole(User user, Role role) {
        if (!user.getRoles().contains(role)) {
            throw new AccessDeniedException("You do not have access to this resource");
        }
    }

    private void ensureAdmin(User user) {
        if (!user.getRoles().contains(Role.ADMIN) && !user.getRoles().contains(Role.SUPER_ADMIN)) {
            throw new AccessDeniedException("You do not have access to this resource");
        }
    }

    private DoctorVerification latestVerification(UUID doctorId) {
        return doctorVerificationRepository.findFirstByDoctorIdOrderBySubmittedAtDesc(doctorId).orElse(null);
    }

    private DoctorVerification findVerification(UUID id) {
        return doctorVerificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor verification request not found"));
    }

    private boolean canSubmit(DoctorVerification verification) {
        return verification == null || verification.getStatus() == DoctorVerificationStatus.REJECTED;
    }

    private DoctorVerificationResponse toResponse(DoctorVerification verification) {
        if (verification == null) {
            return null;
        }

        return new DoctorVerificationResponse(
                verification.getId(),
                verification.getDoctorId(),
                verification.getLicenseNumber(),
                verification.getMedicalCouncil(),
                verification.getDocumentUrl(),
                verification.getStatus(),
                verification.getSubmittedAt(),
                verification.getReviewedAt(),
                verification.getReviewedBy(),
                verification.getRemarks()
        );
    }
}
