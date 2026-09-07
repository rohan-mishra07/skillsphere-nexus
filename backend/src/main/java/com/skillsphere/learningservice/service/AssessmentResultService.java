package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.AssessmentResultDTO;
import com.skillsphere.learningservice.entity.AssessmentResult;
import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.repository.AssessmentResultRepository;
import com.skillsphere.learningservice.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service("learningAssessmentResultService")
@RequiredArgsConstructor
public class AssessmentResultService {

    private final AssessmentResultRepository assessmentResultRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AssessmentResultDTO submitResult(AssessmentResultDTO dto) {
        UUID enrollmentId = dto.getEnrollmentId();
        Enrollment enrollment = null;

        if (enrollmentId != null) {
            enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);
        }

        UUID empId = dto.getEmpId() != null ? dto.getEmpId() : (enrollment != null ? enrollment.getEmpId() : null);
        UUID courseId = dto.getCourseId() != null ? dto.getCourseId() : (enrollment != null && enrollment.getCourse() != null ? enrollment.getCourse().getCourseId() : null);
        Float score = dto.getScore() != null ? dto.getScore() : 0.0f;
        String status = score >= 70.0f ? "PASSED" : "FAILED";

        AssessmentResult result = AssessmentResult.builder()
                .empId(empId)
                .courseId(courseId)
                .enrollmentId(enrollmentId)
                .score(score)
                .resultStatus(dto.getResultStatus() != null ? dto.getResultStatus() : status)
                .assessedAt(LocalDateTime.now())
                .build();

        AssessmentResult saved = assessmentResultRepository.save(result);

        // Update Enrollment score
        if (enrollment != null) {
            enrollment.setScore(score);
            enrollmentRepository.save(enrollment);
        }

        return toDTO(saved);
    }

    public List<AssessmentResultDTO> getResultsForEmployee(UUID empId) {
        return assessmentResultRepository.findByEmpId(empId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<AssessmentResultDTO> getResultsForEnrollment(UUID enrollmentId) {
        return assessmentResultRepository.findByEnrollmentId(enrollmentId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public AssessmentResultDTO getResult(UUID resultId) {
        AssessmentResult result = assessmentResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Assessment Result not found with id: " + resultId));
        return toDTO(result);
    }

    private AssessmentResultDTO toDTO(AssessmentResult res) {
        return AssessmentResultDTO.builder()
                .resultId(res.getResultId())
                .empId(res.getEmpId())
                .courseId(res.getCourseId())
                .enrollmentId(res.getEnrollmentId())
                .score(res.getScore())
                .resultStatus(res.getResultStatus())
                .assessedAt(res.getAssessedAt())
                .build();
    }
}
