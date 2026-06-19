package com.sokhacare.modules.profile.entity;

import com.sokhacare.common.constants.ProfileValidationConstants;
import com.sokhacare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Past;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "patients")
public class Patient extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private UUID userId;

    @Past
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 32)
    private Gender gender;

    @Column(name = "phone_number", nullable = false, length = ProfileValidationConstants.PHONE_NUMBER_MAX)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 32)
    private BloodGroup bloodGroup;

    @Column(name = "address", nullable = false, length = ProfileValidationConstants.ADDRESS_MAX)
    private String address;

    @Column(name = "emergency_contact_name", nullable = false, length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", nullable = false, length = ProfileValidationConstants.PHONE_NUMBER_MAX)
    private String emergencyContactPhone;

    @Column(name = "allergy_summary", nullable = false, length = ProfileValidationConstants.ALLERGY_SUMMARY_MAX)
    private String allergySummary;
}
