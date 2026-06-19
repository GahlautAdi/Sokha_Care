package com.sokhacare.modules.doctoravailability.repository;

import com.sokhacare.modules.doctoravailability.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, UUID> {

    List<DoctorAvailability> findAllByDoctorId(UUID doctorId);

    List<DoctorAvailability> findAllByDoctorIdAndActiveTrue(UUID doctorId);

    Optional<DoctorAvailability> findByIdAndDoctorId(UUID id, UUID doctorId);
}
