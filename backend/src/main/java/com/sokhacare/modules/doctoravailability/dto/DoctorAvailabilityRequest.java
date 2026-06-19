package com.sokhacare.modules.doctoravailability.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.sokhacare.modules.doctoravailability.entity.ConsultationMode;
import com.sokhacare.modules.doctoravailability.entity.DayOfWeek;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record DoctorAvailabilityRequest(
        @NotNull(message = "Day of week is required")
        DayOfWeek dayOfWeek,

        @NotNull(message = "Start time is required")
        @JsonFormat(pattern = "HH:mm")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        @JsonFormat(pattern = "HH:mm")
        LocalTime endTime,

        @NotNull(message = "Consultation mode is required")
        ConsultationMode consultationMode
) {

    @AssertTrue(message = "End time must be greater than start time")
    public boolean isTimeRangeValid() {
        return startTime != null && endTime != null && endTime.isAfter(startTime);
    }
}
