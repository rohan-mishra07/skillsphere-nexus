package com.skillsphere.learningservice.repository;

import com.skillsphere.learningservice.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository("lmsCertificateRepository")
public interface LmsCertificateRepository extends JpaRepository<Certificate, UUID> {
    Optional<Certificate> findByEnrollmentId(UUID enrollmentId);
    List<Certificate> findByEmpId(UUID empId);
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
}
