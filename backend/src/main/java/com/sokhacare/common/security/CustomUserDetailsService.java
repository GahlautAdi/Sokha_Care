package com.sokhacare.common.security;

import com.sokhacare.common.exceptions.ResourceNotFoundException;
import com.sokhacare.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserPrincipal loadUserByUsername(String username) {
        return userRepository.findByEmailIgnoreCase(username)
                .map(UserPrincipal::from)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
