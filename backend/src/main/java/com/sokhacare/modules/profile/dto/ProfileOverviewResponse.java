package com.sokhacare.modules.profile.dto;

import com.sokhacare.modules.users.dto.UserResponse;

public record ProfileOverviewResponse(
        UserResponse user,
        PatientProfileResponse patient,
        DoctorProfileResponse doctor
) {
}
