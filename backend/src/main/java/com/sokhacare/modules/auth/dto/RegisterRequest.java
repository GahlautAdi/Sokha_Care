package com.sokhacare.modules.auth.dto;

import com.sokhacare.common.constants.ValidationConstants;
import com.sokhacare.common.validation.PasswordPolicy;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Size(min = ValidationConstants.NAME_MIN, max = ValidationConstants.NAME_MAX)
        String firstName,

        @NotBlank
        @Size(min = ValidationConstants.NAME_MIN, max = ValidationConstants.NAME_MAX)
        String lastName,

        @NotBlank
        @Email
        @Size(max = ValidationConstants.EMAIL_MAX)
        String email,

        @NotBlank
        @PasswordPolicy
        @Size(min = ValidationConstants.PASSWORD_MIN, max = ValidationConstants.PASSWORD_MAX)
        String password
) {
}
