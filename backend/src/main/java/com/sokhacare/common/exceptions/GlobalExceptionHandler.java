package com.sokhacare.common.exceptions;

import com.sokhacare.common.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler({ConflictException.class, BusinessException.class})
    public ResponseEntity<ApiResponse<Object>> handleBusiness(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorized(UnauthorizedException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure("Validation failed", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolation(ConstraintViolationException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        exception.getConstraintViolations()
                .forEach(violation -> errors.put(violation.getPropertyPath().toString(), violation.getMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure("Validation failed", errors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleMalformedRequest(HttpMessageNotReadableException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.failure("Malformed request body", null));
    }

    @ExceptionHandler({AuthenticationException.class, AccessDeniedException.class})
    public ResponseEntity<ApiResponse<Object>> handleSecurity(RuntimeException exception) {
        HttpStatus status = exception instanceof AccessDeniedException ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED;
        return ResponseEntity.status(status)
                .body(ApiResponse.failure(exception.getMessage(), null));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleUnexpected(Exception exception) {
        log.error("Unexpected error", exception);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.failure("An unexpected error occurred", null));
    }
}
