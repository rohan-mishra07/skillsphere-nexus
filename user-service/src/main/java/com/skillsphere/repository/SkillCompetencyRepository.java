package com.skillsphere.repository;

import com.skillsphere.model.SkillCompetency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SkillCompetencyRepository extends JpaRepository<SkillCompetency, Long> {
    List<SkillCompetency> findByEmployeeId(Long employeeId);
    List<SkillCompetency> findByEmployeeEmpId(UUID employeeEmpId);
}
