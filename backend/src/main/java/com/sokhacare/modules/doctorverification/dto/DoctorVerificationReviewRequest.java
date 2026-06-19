package com.sokhacare.modules.doctorverification.dto;

import com.sokhacare.common.constants.DoctorVerificationValidationConstants;
import jakarta.validation.constraints.Size;

public record DoctorVerificationReviewRequest(
        @Size(max = DoctorVerificationValidationConstants.REMARKS_MAX)
        String remarks
) {
}
