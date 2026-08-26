package com.skillsphere.skillservice.repository;

import com.skillsphere.skillservice.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, UUID> {
    List<Certification> findByEmployeeEmpId(UUID empId);
    List<Certification> findByEmployee_EmpId(UUID empId);
    List<Certification> findByStatus(Certification.Status status);
    List<Certification> findByExpiryBetween(LocalDate start, LocalDate end);
}
