package com.sokhacare.modules.users.mapper;

import com.sokhacare.modules.users.dto.UserResponse;
import com.sokhacare.modules.users.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
