package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.event.TrainingCompletedEvent;
import com.skillsphere.learningservice.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class ProgressService {

    private final EnrollmentRepository enrollmentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public Enrollment updateProgress(UUID enrollmentId, Integer progress) {
        if (progress == null || progress < 0 || progress > 100) {
            throw new IllegalArgumentException("Progress must be an integer between 0 and 100.");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        boolean wasCompleted = Boolean.TRUE.equals(enrollment.getCompleted());
        enrollment.setProgress(progress);

        if (progress == 100) {
            enrollment.setCompleted(true);
            if (enrollment.getCompletedAt() == null) {
                enrollment.setCompletedAt(LocalDateTime.now());
            }
            if (!wasCompleted) {
                publishCompletionEvent(enrollment);
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

        boolean wasCompleted = Boolean.TRUE.equals(enrollment.getCompleted());
        enrollment.setProgress(100);
        enrollment.setCompleted(true);
        enrollment.setCompletedAt(LocalDateTime.now());

        Enrollment saved = enrollmentRepository.save(enrollment);
        if (!wasCompleted) {
            publishCompletionEvent(saved);
        }
        return saved;
    }

    private void publishCompletionEvent(Enrollment enrollment) {
        if (kafkaTemplate == null || enrollment == null) return;
        try {
            String skill = (enrollment.getCourse() != null && enrollment.getCourse().getTitle() != null)
                    ? enrollment.getCourse().getTitle()
                    : "General Technical Upskilling";
            TrainingCompletedEvent event = TrainingCompletedEvent.builder()
                    .empId(enrollment.getEmpId())
                    .courseSkill(skill)
                    .completedAt(enrollment.getCompletedAt() != null ? enrollment.getCompletedAt().toString() : LocalDateTime.now().toString())
                    .build();
            kafkaTemplate.send("training-completed", event.getEmpId() != null ? event.getEmpId().toString() : "unknown", event);
            log.info("[KAFKA-PRODUCER] Published training-completed event for empId: {}, courseSkill: {}", event.getEmpId(), skill);
        } catch (Exception e) {
            log.error("Failed to publish training-completed Kafka event: {}", e.getMessage());
        }
    }
}
