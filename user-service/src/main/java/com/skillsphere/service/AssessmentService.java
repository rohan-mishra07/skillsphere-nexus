package com.skillsphere.service;

import com.skillsphere.dto.AssessmentDTO;
import com.skillsphere.model.Assessment;
import com.skillsphere.model.Employee;
import com.skillsphere.model.Skill;
import com.skillsphere.repository.AssessmentRepository;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final EmployeeRepository employeeRepository;
    private final SkillRepository skillRepository;

    private static final float PASS_THRESHOLD = 70.0f;

    @SuppressWarnings("null")
    public AssessmentDTO createAssessment(AssessmentDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmpId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Skill skill = skillRepository.findById(dto.getSkillId())
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        boolean passed = dto.getScore() != null && dto.getScore() >= PASS_THRESHOLD; // scoring rule

        Assessment assessment = Assessment.builder()
                .employee(employee)
                .skill(skill)
                .score(dto.getScore() != null ? dto.getScore() : 0.0f)
                .passed(passed)
                .verified(false) // verification is a separate HR action
                .build();

        Assessment saved = assessmentRepository.save(assessment);

        return AssessmentDTO.builder()
                .assessId(saved.getAssessId())
                .empId(employee.getEmpId())
                .skillId(skill.getId())
                .score(saved.getScore())
                .passed(saved.getPassed())
                .verified(saved.getVerified())
                .build();
    }

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @SuppressWarnings("null")
    public List<Assessment> getAssessmentsByUserId(Long userId) {
        return assessmentRepository.findByUserId(userId);
    }

    public Assessment saveAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    public Optional<Assessment> getAssessmentById(Long id) {
        return assessmentRepository.findById(id);
    }
}
