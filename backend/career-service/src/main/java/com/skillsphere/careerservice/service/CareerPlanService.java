package com.skillsphere.careerservice.service;

import com.skillsphere.careerservice.dto.CareerPlanDTO;
import com.skillsphere.careerservice.entity.CareerPlan;
import com.skillsphere.careerservice.repository.CareerPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CareerPlanService {

    private final CareerPlanRepository repository;

    public CareerPlanDTO create(CareerPlanDTO dto) {
        int score = calculatePromotionScore(dto);
        CareerPlan.PlanStatus status = CareerPlan.PlanStatus.ACTIVE;
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            try {
                status = CareerPlan.PlanStatus.valueOf(dto.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                status = CareerPlan.PlanStatus.ACTIVE;
            }
        }

        CareerPlan plan = CareerPlan.builder()
                .empId(dto.getEmpId())
                .employeeName(dto.getEmployeeName())
                .currentRole(dto.getCurrentRole())
                .targetRole(dto.getTargetRole())
                .progress(dto.getProgress() != null ? dto.getProgress() : 0)
                .mentor(dto.getMentor())
                .skillGaps(dto.getSkillGaps())
                .trainingPlan(dto.getTrainingPlan())
                .promotionScore(score)
                .promotionEligible(score >= 80)
                .status(status)
                .build();

        return toDTO(repository.save(plan));
    }

    public List<CareerPlanDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public CareerPlanDTO getById(UUID id) {
        CareerPlan plan = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career plan not found"));
        return toDTO(plan);
    }

    public List<CareerPlanDTO> getByEmployee(UUID empId) {
        return repository.findByEmpId(empId).stream().map(this::toDTO).toList();
    }

    public CareerPlanDTO update(UUID id, CareerPlanDTO dto) {
        CareerPlan plan = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career plan not found"));

        if (dto.getEmployeeName() != null) plan.setEmployeeName(dto.getEmployeeName());
        if (dto.getCurrentRole() != null) plan.setCurrentRole(dto.getCurrentRole());
        if (dto.getTargetRole() != null) plan.setTargetRole(dto.getTargetRole());
        if (dto.getProgress() != null) plan.setProgress(dto.getProgress());
        if (dto.getMentor() != null) plan.setMentor(dto.getMentor());
        if (dto.getSkillGaps() != null) plan.setSkillGaps(dto.getSkillGaps());
        if (dto.getTrainingPlan() != null) plan.setTrainingPlan(dto.getTrainingPlan());
        if (dto.getStatus() != null && !dto.getStatus().isBlank()) {
            try {
                plan.setStatus(CareerPlan.PlanStatus.valueOf(dto.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep existing status if invalid
            }
        }

        int score = calculatePromotionScore(toDTO(plan));
        plan.setPromotionScore(score);
        plan.setPromotionEligible(score >= 80);

        return toDTO(repository.save(plan));
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Career plan not found");
        }
        repository.deleteById(id);
    }

    private int calculatePromotionScore(CareerPlanDTO dto) {
        if (dto == null) return 0;
        int score = 0;
        if (dto.getProgress() != null) {
            score += (int) (dto.getProgress() * 0.6);
        }
        if (dto.getSkillGaps() == null || dto.getSkillGaps().isBlank()) {
            score += 20;
        }
        if (dto.getTrainingPlan() != null && !dto.getTrainingPlan().isBlank()) {
            score += 20;
        }
        return Math.min(score, 100);
    }

    private CareerPlanDTO toDTO(CareerPlan p) {
        if (p == null) return null;
        return CareerPlanDTO.builder()
                .planId(p.getPlanId())
                .empId(p.getEmpId())
                .employeeName(p.getEmployeeName())
                .currentRole(p.getCurrentRole())
                .targetRole(p.getTargetRole())
                .progress(p.getProgress())
                .mentor(p.getMentor())
                .skillGaps(p.getSkillGaps())
                .trainingPlan(p.getTrainingPlan())
                .promotionScore(p.getPromotionScore())
                .promotionEligible(p.getPromotionEligible())
                .status(p.getStatus() != null ? p.getStatus().name() : null)
                .build();
    }
}
