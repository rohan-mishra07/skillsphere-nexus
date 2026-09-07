package com.skillsphere.careerservice.repository;

import com.skillsphere.careerservice.entity.CareerPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CareerPlanRepository extends JpaRepository<CareerPlan, UUID> {
    List<CareerPlan> findByEmpId(UUID empId);
    long countByStatus(CareerPlan.PlanStatus status);
    long countByPromotionEligibleTrue();
}
