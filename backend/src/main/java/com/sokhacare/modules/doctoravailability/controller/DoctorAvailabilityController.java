package com.sokhacare.modules.doctoravailability.controller;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.response.ApiResponse;
import com.sokhacare.modules.doctoravailability.dto.DoctorAvailabilityRequest;
import com.sokhacare.modules.doctoravailability.dto.DoctorAvailabilityResponse;
import com.sokhacare.modules.doctoravailability.service.DoctorAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiConstants.DOCTOR_AVAILABILITY_PATH)
@RequiredArgsConstructor
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService doctorAvailabilityService;

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping
    public ResponseEntity<ApiResponse<DoctorAvailabilityResponse>> create(@Valid @RequestBody DoctorAvailabilityRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Doctor availability created successfully", doctorAvailabilityService.create(request)));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorAvailabilityResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody DoctorAvailabilityRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Doctor availability updated successfully", doctorAvailabilityService.update(id, request)));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorAvailabilityResponse>> delete(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success("Doctor availability deleted successfully", doctorAvailabilityService.delete(id)));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityResponse>>> me() {
        return ResponseEntity.ok(ApiResponse.success("Doctor availability loaded successfully", doctorAvailabilityService.getMyAvailability()));
    }
}
