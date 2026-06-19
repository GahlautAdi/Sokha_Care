package com.sokhacare.modules.doctorverification.dto;

import com.sokhacare.modules.doctorverification.entity.DoctorVerificationStatus;

import java.time.Instant;
import java.util.UUID;

public record DoctorVerificationResponse(
        UUID id,
        UUID doctorId,
        String licenseNumber,
        String medicalCouncil,
        String documentUrl,
        DoctorVerificationStatus status,
        Instant submittedAt,
        Instant reviewedAt,
        UUID reviewedBy,
        String remarks
) {
}
