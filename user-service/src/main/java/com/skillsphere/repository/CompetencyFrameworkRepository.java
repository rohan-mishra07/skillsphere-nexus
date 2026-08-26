package com.skillsphere.repository;

import com.skillsphere.model.CompetencyFramework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetencyFrameworkRepository extends JpaRepository<CompetencyFramework, Long> {
    List<CompetencyFramework> findByRoleTitle(String roleTitle);
    List<CompetencyFramework> findBySkillCategory(String skillCategory);
}
