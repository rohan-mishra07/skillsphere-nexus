package com.skillsphere.repository;

import com.skillsphere.model.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, UUID> {
    List<AssessmentResult> findByEmpId(UUID empId);
    List<AssessmentResult> findByEnrollmentId(UUID enrollmentId);
}
