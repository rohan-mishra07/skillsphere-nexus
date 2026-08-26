package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ProgressService {

    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public Enrollment updateProgress(UUID enrollmentId, Integer progress) {
        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be an integer between 0 and 100.");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        enrollment.setProgress(progress);

        if (progress == 100) {
            enrollment.setCompleted(true);
            if (enrollment.getCompletedAt() == null) {
                enrollment.setCompletedAt(LocalDateTime.now());
            }
        }

        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment submitAssessment(UUID enrollmentId, Float score) {
        if (score == null || score < 0.0f || score > 100.0f) {
            throw new IllegalArgumentException("Score must be a float between 0.0 and 100.0.");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        enrollment.setScore(score);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment completeCourse(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        enrollment.setProgress(100);
        enrollment.setCompleted(true);
        enrollment.setCompletedAt(LocalDateTime.now());

        return enrollmentRepository.save(enrollment);
    }
}
