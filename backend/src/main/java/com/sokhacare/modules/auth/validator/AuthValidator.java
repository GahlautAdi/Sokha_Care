package com.sokhacare.modules.auth.validator;

import com.sokhacare.common.exceptions.ConflictException;
import com.sokhacare.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthValidator {

    private final UserRepository userRepository;

    public void ensureEmailIsAvailable(String email) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("A user with this email already exists");
        }
    }
}
