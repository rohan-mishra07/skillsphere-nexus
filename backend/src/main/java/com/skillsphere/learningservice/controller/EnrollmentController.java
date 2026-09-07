package com.skillsphere.learningservice.controller;

import com.skillsphere.learningservice.dto.EnrollmentDTO;
import com.skillsphere.learningservice.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import com.skillsphere.learningservice.dto.EnrollmentRequest;

@RestController("learningEnrollmentController")
@RequestMapping("/api/learning/enrollments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public EnrollmentDTO enroll(
            @RequestBody(required = false) EnrollmentRequest request,
            @RequestParam(required = false) UUID empId,
            @RequestParam(required = false) UUID courseId) {
        UUID targetEmpId = (request != null && request.getEmpId() != null) ? request.getEmpId() : empId;
        UUID targetCourseId = (request != null && request.getCourseId() != null) ? request.getCourseId() : courseId;
        
        if (targetEmpId == null || targetCourseId == null) {
            throw new IllegalArgumentException("Both empId and courseId must be provided in request body or request parameters");
        }
        
        return enrollmentService.enroll(targetEmpId, targetCourseId);
    }

    @GetMapping("/employee/{empId}")
    public List<EnrollmentDTO> getEmployeeEnrollments(
            @PathVariable UUID empId) {
        return enrollmentService.getEmployeeEnrollments(empId);
    }

    @GetMapping
    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentService.getAllEnrollments();
    }

    @GetMapping("/{id}")
    public EnrollmentDTO getEnrollmentById(@PathVariable UUID id) {
        return enrollmentService.getEnrollmentById(id);
    }

    @PutMapping("/{enrollmentId}/progress")
    public EnrollmentDTO updateProgress(
            @PathVariable UUID enrollmentId,
            @RequestParam Integer progress,
            @RequestParam(required = false) Float score) {
        return enrollmentService.updateProgress(enrollmentId, progress, score);
    }
}
