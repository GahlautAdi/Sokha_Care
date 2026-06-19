package com.sokhacare.modules.profile.dto;

import com.sokhacare.common.constants.ProfileValidationConstants;
import com.sokhacare.modules.profile.entity.ConsultationMode;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record DoctorProfileRequest(
        @NotBlank
        @Size(max = ProfileValidationConstants.SPECIALTY_MAX)
        String specialty,

        @NotNull
        @DecimalMin(value = "0.00", inclusive = true)
        BigDecimal consultationFee,

        @NotBlank
        @Size(max = ProfileValidationConstants.BIO_MAX)
        String bio,

        @NotNull
        ConsultationMode consultationMode,

        @Size(max = ProfileValidationConstants.PROFILE_PHOTO_URL_MAX)
        String profilePhotoUrl,

        @NotNull
        Boolean active
) {
}
