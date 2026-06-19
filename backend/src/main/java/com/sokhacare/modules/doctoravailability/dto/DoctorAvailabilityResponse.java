package com.sokhacare.modules.doctoravailability.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sokhacare.modules.doctoravailability.entity.ConsultationMode;
import com.sokhacare.modules.doctoravailability.entity.DayOfWeek;

import java.time.Instant;
import java.time.LocalTime;
import java.util.UUID;

public record DoctorAvailabilityResponse(
        UUID id,
        UUID doctorId,
        DayOfWeek dayOfWeek,
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,
        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,
        ConsultationMode consultationMode,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
}
