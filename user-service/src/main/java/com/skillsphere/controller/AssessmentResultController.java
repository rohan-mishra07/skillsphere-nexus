package com.skillsphere.controller;

import com.skillsphere.dto.AssessmentResultDTO;
import com.skillsphere.service.AssessmentResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning/assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AssessmentResultController {

    private final AssessmentResultService assessmentResultService;

    @PostMapping
    public AssessmentResultDTO submitResult(@RequestBody AssessmentResultDTO dto) {
        return assessmentResultService.submitResult(dto);
    }

    @GetMapping("/employee/{empId}")
    public List<AssessmentResultDTO> getResultsForEmployee(@PathVariable UUID empId) {
        return assessmentResultService.getResultsForEmployee(empId);
    }

    @GetMapping("/enrollment/{enrollmentId}")
    public List<AssessmentResultDTO> getResultsForEnrollment(@PathVariable UUID enrollmentId) {
        return assessmentResultService.getResultsForEnrollment(enrollmentId);
    }

    @GetMapping("/{id}")
    public AssessmentResultDTO getResult(@PathVariable UUID id) {
        return assessmentResultService.getResult(id);
    }
}
