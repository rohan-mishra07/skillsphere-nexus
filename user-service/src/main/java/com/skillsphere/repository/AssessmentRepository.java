package com.skillsphere.repository;

import com.skillsphere.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@SuppressWarnings("null")
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByUserId(Long userId);
    List<Assessment> findByStatus(String status);
    List<Assessment> findByEmployeeEmpId(UUID employeeEmpId);
}
