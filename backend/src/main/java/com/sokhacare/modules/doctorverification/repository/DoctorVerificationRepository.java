package com.sokhacare.modules.doctorverification.repository;

import com.sokhacare.modules.doctorverification.entity.DoctorVerification;
import com.sokhacare.modules.doctorverification.entity.DoctorVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, UUID> {

    Optional<DoctorVerification> findFirstByDoctorIdOrderBySubmittedAtDesc(UUID doctorId);

    List<DoctorVerification> findAllByOrderBySubmittedAtDesc();

    boolean existsByDoctorIdAndStatusIn(UUID doctorId, List<DoctorVerificationStatus> statuses);
}
