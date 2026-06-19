package com.sokhacare.modules.doctorverification.controller;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.response.ApiResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationStatusResponse;
import com.sokhacare.modules.doctorverification.dto.DoctorVerificationSubmitRequest;
import com.sokhacare.modules.doctorverification.service.DoctorVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiConstants.API_V1 + "/doctor-verification")
@RequiredArgsConstructor
public class DoctorVerificationController {

    private final DoctorVerificationService doctorVerificationService;

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<DoctorVerificationStatusResponse>> status() {
        return ResponseEntity.ok(ApiResponse.success("Doctor verification status loaded successfully", doctorVerificationService.getStatus()));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<DoctorVerificationResponse>> submit(@Valid @RequestBody DoctorVerificationSubmitRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Doctor verification submitted successfully", doctorVerificationService.submit(request)));
    }
}
