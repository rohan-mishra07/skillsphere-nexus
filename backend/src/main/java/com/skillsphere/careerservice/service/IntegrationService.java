package com.skillsphere.careerservice.service;

import com.skillsphere.careerservice.dto.IntegratedCareerDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IntegrationService {

    private final SkillGapService skillGapService;
    private final LearningIntegrationService learningIntegrationService;
    private final CertificationIntegrationService certificationIntegrationService;

    public IntegratedCareerDTO getIntegratedCareer(UUID empId, String targetRole) {
        Object skillGaps = skillGapService.getSkillGaps(empId, targetRole);
        Object courses = learningIntegrationService.getCourses();
        Object enrollments = learningIntegrationService.getEnrollments(empId);
        Object certifications = certificationIntegrationService.getEmployeeCertifications(empId);

        return IntegratedCareerDTO.builder()
                .employeeId(empId)
                .targetRole(targetRole)
                .skillGaps(skillGaps)
                .courses(courses)
                .enrollments(enrollments)
                .certifications(certifications)
                .build();
    }
}
