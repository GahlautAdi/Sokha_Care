package com.sokhacare.modules.profile.controller;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.response.ApiResponse;
import com.sokhacare.modules.profile.dto.DoctorProfileRequest;
import com.sokhacare.modules.profile.dto.DoctorProfileResponse;
import com.sokhacare.modules.profile.dto.PatientProfileRequest;
import com.sokhacare.modules.profile.dto.PatientProfileResponse;
import com.sokhacare.modules.profile.dto.ProfileOverviewResponse;
import com.sokhacare.modules.profile.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiConstants.PROFILE_PATH)
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileOverviewResponse>> me() {
        return ResponseEntity.ok(ApiResponse.success("Profile loaded successfully", profileService.getMe()));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patient")
    public ResponseEntity<ApiResponse<PatientProfileResponse>> getPatientProfile() {
        return ResponseEntity.ok(ApiResponse.success("Patient profile loaded successfully", profileService.getPatientProfile()));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @PutMapping("/patient")
    public ResponseEntity<ApiResponse<PatientProfileResponse>> updatePatientProfile(@Valid @RequestBody PatientProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Patient profile saved successfully", profileService.upsertPatientProfile(request)));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor")
    public ResponseEntity<ApiResponse<DoctorProfileResponse>> getDoctorProfile() {
        return ResponseEntity.ok(ApiResponse.success("Doctor profile loaded successfully", profileService.getDoctorProfile()));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/doctor")
    public ResponseEntity<ApiResponse<DoctorProfileResponse>> updateDoctorProfile(@Valid @RequestBody DoctorProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Doctor profile saved successfully", profileService.upsertDoctorProfile(request)));
    }
}
