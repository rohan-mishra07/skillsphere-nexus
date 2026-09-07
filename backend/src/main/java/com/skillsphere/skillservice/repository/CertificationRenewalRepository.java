package com.skillsphere.skillservice.repository;

import com.skillsphere.skillservice.entity.CertificationRenewal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificationRenewalRepository extends JpaRepository<CertificationRenewal, UUID> {
    List<CertificationRenewal> findByCertificationCertId(UUID certificationId);
}
