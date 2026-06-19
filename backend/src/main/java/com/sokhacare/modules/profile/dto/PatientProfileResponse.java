package com.sokhacare.modules.profile.dto;

import com.sokhacare.modules.profile.entity.BloodGroup;
import com.sokhacare.modules.profile.entity.Gender;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record PatientProfileResponse(
        UUID id,
        UUID userId,
        LocalDate dateOfBirth,
        Gender gender,
        String phoneNumber,
        BloodGroup bloodGroup,
        String address,
        String emergencyContactName,
        String emergencyContactPhone,
        String allergySummary,
        Instant createdAt,
        Instant updatedAt
) {
}
