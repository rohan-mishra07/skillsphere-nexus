package com.skillsphere.learningservice.controller;

import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/learning/progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProgressController {

    private final ProgressService progressService;

    @PutMapping("/{enrollmentId}")
    public ResponseEntity<Enrollment> updateProgress(
            @PathVariable UUID enrollmentId,
            @RequestParam Integer progress) {
        Enrollment updated = progressService.updateProgress(enrollmentId, progress);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{enrollmentId}/assessment")
    public ResponseEntity<Enrollment> submitAssessment(
            @PathVariable UUID enrollmentId,
            @RequestParam Float score) {
        Enrollment updated = progressService.submitAssessment(enrollmentId, score);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{enrollmentId}/complete")
    public ResponseEntity<Enrollment> completeCourse(@PathVariable UUID enrollmentId) {
        Enrollment updated = progressService.completeCourse(enrollmentId);
        return ResponseEntity.ok(updated);
    }
}
