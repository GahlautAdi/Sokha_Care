package com.sokhacare.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordPolicyValidator implements ConstraintValidator<PasswordPolicy, String> {

    private static final String PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,72}$";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value != null && value.matches(PASSWORD_REGEX);
    }
}
