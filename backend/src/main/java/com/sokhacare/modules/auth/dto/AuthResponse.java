package com.sokhacare.modules.auth.dto;

import com.sokhacare.modules.users.dto.UserResponse;

public record AuthResponse(
        String tokenType,
        String accessToken,
        String refreshToken,
        UserResponse user
) {
}
