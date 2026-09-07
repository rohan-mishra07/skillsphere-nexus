package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.AssessmentResultDTO;
import com.skillsphere.learningservice.entity.AssessmentResult;
import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.repository.AssessmentResultRepository;
import com.skillsphere.learningservice.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssessmentResultService {

    private final AssessmentResultRepository assessmentResultRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AssessmentResultDTO submitResult(@NonNull AssessmentResultDTO dto) {
        Objects.requireNonNull(dto, "dto must not be null");
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

        AssessmentResult saved = assessmentResultRepository.save(Objects.requireNonNull(result, "result must not be null"));

        // Update Enrollment score
        if (enrollment != null) {
            enrollment.setScore(score);
            enrollmentRepository.save(Objects.requireNonNull(enrollment, "enrollment must not be null"));
        }

        return toDTO(saved);
    }

    public List<AssessmentResultDTO> getResultsForEmployee(@NonNull UUID empId) {
        Objects.requireNonNull(empId, "empId must not be null");
        return assessmentResultRepository.findByEmpId(empId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<AssessmentResultDTO> getResultsForEnrollment(@NonNull UUID enrollmentId) {
        Objects.requireNonNull(enrollmentId, "enrollmentId must not be null");
        return assessmentResultRepository.findByEnrollmentId(enrollmentId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public AssessmentResultDTO getResult(@NonNull UUID resultId) {
        Objects.requireNonNull(resultId, "resultId must not be null");
        AssessmentResult result = assessmentResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Assessment Result not found with id: " + resultId));
        return toDTO(result);
    }

    private AssessmentResultDTO toDTO(AssessmentResult res) {
        if (res == null) return null;
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

