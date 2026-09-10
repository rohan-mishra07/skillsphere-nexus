package com.skillsphere.careerservice.service;

import com.skillsphere.careerservice.dto.AnalyticsDTO;
import com.skillsphere.careerservice.entity.CareerPlan;
import com.skillsphere.careerservice.repository.CareerPlanRepository;
import com.skillsphere.careerservice.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final CareerPlanRepository careerPlanRepository;
    private final JobRepository jobRepository;

    public AnalyticsDTO getAnalytics() {
        List<CareerPlan> plans = careerPlanRepository.findAll();

        double averageProgress = plans.stream()
                .filter(p -> p.getProgress() != null)
                .mapToInt(CareerPlan::getProgress)
                .average()
                .orElse(0.0);

        averageProgress = Math.round(averageProgress * 100.0) / 100.0;

        double skillCoverage = calculateSkillCoverage(plans);
        skillCoverage = Math.round(skillCoverage * 100.0) / 100.0;

        return AnalyticsDTO.builder()
                .totalCareerPlans(plans.size())
                .activeCareerPlans(careerPlanRepository.countByStatus(CareerPlan.PlanStatus.ACTIVE))
                .completedPlans(careerPlanRepository.countByStatus(CareerPlan.PlanStatus.COMPLETED))
                .promotionEligible(careerPlanRepository.countByPromotionEligibleTrue())
                .averageProgress(averageProgress)
                .skillCoverage(skillCoverage)
                .activeJobs(jobRepository.findByActiveTrue().size())
                .build();
    }

    private double calculateSkillCoverage(List<CareerPlan> plans) {
        if (plans.isEmpty()) return 0.0;
        long withoutGap = plans.stream()
                .filter(p -> p.getSkillGaps() == null || p.getSkillGaps().isBlank())
                .count();
        return (withoutGap * 100.0) / plans.size();
    }
}
