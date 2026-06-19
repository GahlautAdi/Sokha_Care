package com.sokhacare.modules.doctoravailability.controller;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.response.ApiResponse;
import com.sokhacare.modules.doctoravailability.dto.DoctorAvailabilityResponse;
import com.sokhacare.modules.doctoravailability.service.DoctorAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiConstants.API_V1 + "/doctors")
@RequiredArgsConstructor
public class DoctorPublicAvailabilityController {

    private final DoctorAvailabilityService doctorAvailabilityService;

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<ApiResponse<List<DoctorAvailabilityResponse>>> listByDoctor(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(ApiResponse.success("Doctor availability loaded successfully", doctorAvailabilityService.getDoctorAvailability(doctorId)));
    }
}
