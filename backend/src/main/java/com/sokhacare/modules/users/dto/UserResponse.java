package com.sokhacare.modules.users.dto;

import com.sokhacare.modules.users.entity.Role;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Set<Role> roles,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
) {
}
