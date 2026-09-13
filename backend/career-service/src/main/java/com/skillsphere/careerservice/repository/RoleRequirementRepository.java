package com.skillsphere.careerservice.repository;

import com.skillsphere.careerservice.entity.RoleRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRequirementRepository extends JpaRepository<RoleRequirement, UUID> {
    Optional<RoleRequirement> findByRoleNameIgnoreCase(String roleName);
}
