package com.skillsphere.skillservice.repository;

import com.skillsphere.skillservice.entity.CertificationAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificationAuditRepository extends JpaRepository<CertificationAudit, UUID> {
    List<CertificationAudit> findByCertificationIdOrderByPerformedAtDesc(UUID certificationId);
}
