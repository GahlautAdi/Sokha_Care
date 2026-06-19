package com.sokhacare.modules.profile.dto;

import com.sokhacare.common.constants.ProfileValidationConstants;
import com.sokhacare.modules.profile.entity.BloodGroup;
import com.sokhacare.modules.profile.entity.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PatientProfileRequest(
        @NotNull
        @Past
        LocalDate dateOfBirth,

        @NotNull
        Gender gender,

        @NotBlank
        @Pattern(regexp = "^\\+?[0-9]{7,20}$", message = "Phone number must contain 7 to 20 digits and may start with +")
        String phoneNumber,

        @NotNull
        BloodGroup bloodGroup,

        @NotBlank
        @Size(max = ProfileValidationConstants.ADDRESS_MAX)
        String address,

        @NotBlank
        @Size(max = 100)
        String emergencyContactName,

        @NotBlank
        @Pattern(regexp = "^\\+?[0-9]{7,20}$", message = "Phone number must contain 7 to 20 digits and may start with +")
        String emergencyContactPhone,

        @NotBlank
        @Size(max = ProfileValidationConstants.ALLERGY_SUMMARY_MAX)
        String allergySummary
) {
}
