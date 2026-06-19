package com.sokhacare.modules.doctorverification.dto;

import java.util.UUID;

public record DoctorVerificationStatusResponse(
        UUID doctorId,
        boolean doctorProfileExists,
        boolean canSubmit,
        DoctorVerificationResponse latestVerification
) {
}
