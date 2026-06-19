package com.sokhacare.modules.auth.service;

import com.sokhacare.common.exceptions.UnauthorizedException;
import com.sokhacare.common.security.JwtService;
import com.sokhacare.common.security.UserPrincipal;
import com.sokhacare.common.utils.StringUtils;
import com.sokhacare.modules.auth.dto.AuthResponse;
import com.sokhacare.modules.auth.dto.LoginRequest;
import com.sokhacare.modules.auth.dto.RefreshTokenRequest;
import com.sokhacare.modules.auth.dto.RegisterRequest;
import com.sokhacare.modules.auth.mapper.AuthMapper;
import com.sokhacare.modules.auth.validator.AuthValidator;
import com.sokhacare.modules.users.entity.Role;
import com.sokhacare.modules.users.entity.User;
import com.sokhacare.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthMapper authMapper;
    private final AuthValidator authValidator;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = StringUtils.normalizeEmail(request.email());
        authValidator.ensureEmailIsAvailable(normalizedEmail);

        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .enabled(true)
                .accountNonLocked(true)
                .roles(EnumSet.of(Role.PATIENT))
                .build();

        User savedUser = userRepository.save(user);
        UserPrincipal principal = UserPrincipal.from(savedUser);

        String accessToken = jwtService.generateAccessToken(principal);
        String refreshToken = jwtService.generateRefreshToken(principal);
        return authMapper.toAuthResponse(savedUser, accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = StringUtils.normalizeEmail(request.email());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmailIgnoreCase(principal.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        String accessToken = jwtService.generateAccessToken(principal);
        String refreshToken = jwtService.generateRefreshToken(principal);
        return authMapper.toAuthResponse(user, accessToken, refreshToken);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        try {
            String refreshToken = request.refreshToken();
            if (!jwtService.isRefreshToken(refreshToken)) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            String email = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

            UserPrincipal principal = UserPrincipal.from(user);
            if (!jwtService.isTokenValid(refreshToken, principal, com.sokhacare.common.constants.SecurityConstants.TOKEN_TYPE_REFRESH)) {
                throw new UnauthorizedException("Invalid refresh token");
            }

            String accessToken = jwtService.generateAccessToken(principal);
            String newRefreshToken = jwtService.generateRefreshToken(principal);
            return authMapper.toAuthResponse(user, accessToken, newRefreshToken);
        } catch (RuntimeException exception) {
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
}
