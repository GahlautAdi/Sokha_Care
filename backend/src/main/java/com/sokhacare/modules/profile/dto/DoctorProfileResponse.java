package com.sokhacare.modules.profile.dto;

import com.sokhacare.modules.profile.entity.ConsultationMode;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record DoctorProfileResponse(
        UUID id,
        UUID userId,
        String specialty,
        BigDecimal consultationFee,
        String bio,
        ConsultationMode consultationMode,
        String profilePhotoUrl,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
