package com.sokhacare.modules.doctorverification.dto;

import com.sokhacare.common.constants.DoctorVerificationValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DoctorVerificationSubmitRequest(
        @NotBlank
        @Size(max = DoctorVerificationValidationConstants.LICENSE_NUMBER_MAX)
        String licenseNumber,

        @NotBlank
        @Size(max = DoctorVerificationValidationConstants.MEDICAL_COUNCIL_MAX)
        String medicalCouncil,

        @NotBlank
        @Size(max = DoctorVerificationValidationConstants.DOCUMENT_URL_MAX)
        String documentUrl
) {
}
