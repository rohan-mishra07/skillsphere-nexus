package com.skillsphere.repository;

import com.skillsphere.model.LearningCertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LearningCertificateRepository extends JpaRepository<LearningCertificate, UUID> {
    List<LearningCertificate> findByEmpId(UUID empId);
    Optional<LearningCertificate> findByEnrollmentId(UUID enrollmentId);
}
