package com.sokhacare.modules.admin.controller;

import com.sokhacare.common.constants.ApiConstants;
import com.sokhacare.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping(ApiConstants.HEALTH_PATH)
public class HealthController {

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> health() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", "UP");
        data.put("service", "Sokha Care");
        data.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(ApiResponse.success(ApiConstants.DEFAULT_SUCCESS_MESSAGE, data));
    }
}
