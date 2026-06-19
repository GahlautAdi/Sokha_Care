package com.sokhacare.modules.profile.entity;

import com.sokhacare.common.constants.ProfileValidationConstants;
import com.sokhacare.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Entity
@Table(name = "doctors")
public class Doctor extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true, updatable = false)
    private UUID userId;

    @Column(name = "specialty", nullable = false, length = ProfileValidationConstants.SPECIALTY_MAX)
    private String specialty;

    @Column(name = "consultation_fee", nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(name = "bio", nullable = false, length = ProfileValidationConstants.BIO_MAX)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "consultation_mode", nullable = false, length = 32)
    private ConsultationMode consultationMode;

    @Column(name = "profile_photo_url", length = ProfileValidationConstants.PROFILE_PHOTO_URL_MAX)
    private String profilePhotoUrl;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
