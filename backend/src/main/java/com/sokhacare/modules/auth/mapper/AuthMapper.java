package com.sokhacare.modules.auth.mapper;

import com.sokhacare.modules.auth.dto.AuthResponse;
import com.sokhacare.modules.users.dto.UserResponse;
import com.sokhacare.modules.users.entity.User;
import com.sokhacare.modules.users.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthMapper {

    private final UserMapper userMapper;

    public AuthResponse toAuthResponse(User user, String accessToken, String refreshToken) {
        UserResponse userResponse = userMapper.toResponse(user);
        return new AuthResponse("Bearer", accessToken, refreshToken, userResponse);
    }
}
