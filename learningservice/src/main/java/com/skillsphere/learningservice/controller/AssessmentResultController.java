package com.skillsphere.learningservice.controller;

import com.skillsphere.learningservice.dto.AssessmentResultDTO;
import com.skillsphere.learningservice.service.AssessmentResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning/assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AssessmentResultController {

    private final AssessmentResultService assessmentResultService;

    @PostMapping
    public AssessmentResultDTO submitResult(@RequestBody @NonNull AssessmentResultDTO dto) {
        return assessmentResultService.submitResult(Objects.requireNonNull(dto, "dto must not be null"));
    }

    @GetMapping("/employee/{empId}")
    public List<AssessmentResultDTO> getResultsForEmployee(@PathVariable @NonNull UUID empId) {
        return assessmentResultService.getResultsForEmployee(Objects.requireNonNull(empId, "empId must not be null"));
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public List<AssessmentResultDTO> getResultsForEnrollment(@PathVariable @NonNull UUID enrollmentId) {
        return assessmentResultService.getResultsForEnrollment(Objects.requireNonNull(enrollmentId, "enrollmentId must not be null"));
    }

    @GetMapping("/{id}")
    public AssessmentResultDTO getResult(@PathVariable @NonNull UUID id) {
        return assessmentResultService.getResult(Objects.requireNonNull(id, "id must not be null"));
    }
}

