package com.skillsphere.careerservice.listener;

import com.skillsphere.careerservice.dto.CareerPlanDTO;
import com.skillsphere.careerservice.entity.CareerPlan;
import com.skillsphere.careerservice.event.TrainingCompletedEvent;
import com.skillsphere.careerservice.repository.CareerPlanRepository;
import com.skillsphere.careerservice.service.CareerPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class TrainingCompletedEventListener {

    private final CareerPlanRepository repository;
    private final CareerPlanService careerPlanService;

    @KafkaListener(topics = "training-completed", groupId = "career-service-group")
    public void handleTrainingCompleted(TrainingCompletedEvent event) {
        if (event == null || event.getEmpId() == null || event.getCourseSkill() == null) {
            log.warn("[KAFKA-CONSUMER] Received invalid training-completed event: {}", event);
            return;
        }

        processEvent(event.getEmpId(), event.getCourseSkill());
    }

    public void processEvent(UUID empId, String courseSkill) {
        List<CareerPlan> plans = repository.findByEmpId(empId);
        if (plans.isEmpty()) {
            log.warn("[AUTO-PROGRESS] No career plan found for empId: {}", empId);
            return;
        }

        // Pick active plan or first plan
        CareerPlan plan = plans.stream()
                .filter(p -> p.getStatus() == CareerPlan.PlanStatus.ACTIVE)
                .findFirst()
                .orElse(plans.get(0));

        String currentSkills = plan.getEmployeeSkills();
        String updatedSkills;

        if (currentSkills == null || currentSkills.isBlank()) {
            updatedSkills = courseSkill.trim();
        } else {
            boolean alreadyPresent = java.util.Arrays.stream(currentSkills.split(","))
                    .map(String::trim)
                    .anyMatch(s -> s.equalsIgnoreCase(courseSkill.trim()));

            if (!alreadyPresent) {
                updatedSkills = currentSkills.trim() + ", " + courseSkill.trim();
            } else {
                updatedSkills = currentSkills.trim();
            }
        }

        // Re-run computeSkillGaps
        String newSkillGaps = careerPlanService.computeSkillGaps(updatedSkills, plan.getTargetRole());
        plan.setEmployeeSkills(updatedSkills);
        plan.setSkillGaps(newSkillGaps);

        // Increase progress by +10 per resolved gap, capped at 100
        int currentProgress = plan.getProgress() != null ? plan.getProgress() : 0;
        int newProgress = Math.min(100, currentProgress + 10);
        plan.setProgress(newProgress);

        // Set lastAutoUpdate timestamp
        plan.setLastAutoUpdate(LocalDateTime.now().toString());

        // Recalculate promotion score & eligibility
        CareerPlanDTO tempDto = careerPlanService.toDTO(plan);
        int newScore = careerPlanService.calculatePromotionScore(tempDto);
        plan.setPromotionScore(newScore);
        plan.setPromotionEligible(newScore >= 80);

        repository.save(plan);

        log.info("[AUTO-PROGRESS] Employee {} completed {} — progress now {}%, remaining gaps: {}",
                empId, courseSkill, newProgress, newSkillGaps.isBlank() ? "None" : newSkillGaps);
    }
}
