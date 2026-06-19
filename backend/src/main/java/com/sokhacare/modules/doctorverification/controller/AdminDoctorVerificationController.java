package com.sokhacare.modules.doctorverification.controller;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.response.ApiResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationReviewRequest;
import com.sokhacare.modules.doctorverification.service.DoctorVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiConstants.ADMIN_PATH + "/doctor-verifications")
@RequiredArgsConstructor
public class AdminDoctorVerificationController {

    private final DoctorVerificationService doctorVerificationService;

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorVerificationResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success("Doctor verification requests loaded successfully", doctorVerificationService.listAll()));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorVerificationResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Doctor verification request loaded successfully", doctorVerificationService.getById(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<DoctorVerificationResponse>> approve(
            @PathVariable UUID id,
            @Valid @RequestBody(required = false) DoctorVerificationReviewRequest request
    ) {
        DoctorVerificationReviewRequest reviewRequest = request == null ? new DoctorVerificationReviewRequest(null) : request;
        return ResponseEntity.ok(ApiResponse.success("Doctor verification approved successfully", doctorVerificationService.approve(id, reviewRequest)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<DoctorVerificationResponse>> reject(
            @PathVariable UUID id,
            @Valid @RequestBody DoctorVerificationReviewRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Doctor verification rejected successfully", doctorVerificationService.reject(id, request)));
    }
}
