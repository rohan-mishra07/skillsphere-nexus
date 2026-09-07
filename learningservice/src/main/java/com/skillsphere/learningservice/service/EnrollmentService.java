package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.EnrollmentDTO;
import com.skillsphere.learningservice.entity.Course;
import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.repository.CourseRepository;
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
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentDTO enroll(@NonNull UUID empId, @NonNull UUID courseId) {
        Objects.requireNonNull(empId, "empId must not be null");
        Objects.requireNonNull(courseId, "courseId must not be null");
        Course course = courseRepository.findById(courseId)
                .orElseGet(() -> courseRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId)));

        Enrollment enrollment = Enrollment.builder()
                .empId(empId)
                .course(course)
                .enrolledAt(LocalDateTime.now())
                .progress(0)
                .completed(false)
                .score(0.0f)
                .build();

        return toDTO(enrollmentRepository.save(Objects.requireNonNull(enrollment, "enrollment must not be null")));
    }

    public List<EnrollmentDTO> getEmployeeEnrollments(@NonNull UUID empId) {
        Objects.requireNonNull(empId, "empId must not be null");
        return enrollmentRepository.findByEmpId(empId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<EnrollmentDTO> getAllEnrollments() {
        return enrollmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public EnrollmentDTO getEnrollmentById(@NonNull UUID enrollmentId) {
        Objects.requireNonNull(enrollmentId, "enrollmentId must not be null");
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        return toDTO(enrollment);
    }

    public EnrollmentDTO updateProgress(@NonNull UUID enrollmentId, Integer progress, Float score) {
        Objects.requireNonNull(enrollmentId, "enrollmentId must not be null");
        if (progress != null && (progress < 0 || progress > 100)) {
            throw new IllegalArgumentException("Invalid progress percentage. Progress must be between 0 and 100.");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        if (progress != null) {
            enrollment.setProgress(progress);
            if (progress >= 100) {
                enrollment.setCompleted(true);
                if (enrollment.getCompletedAt() == null) {
                    enrollment.setCompletedAt(LocalDateTime.now());
                }
            } else {
                enrollment.setCompleted(false);
                enrollment.setCompletedAt(null);
            }
        }

        if (score != null) {
            enrollment.setScore(score);
        }

        return toDTO(enrollmentRepository.save(Objects.requireNonNull(enrollment, "enrollment must not be null")));
    }

    private EnrollmentDTO toDTO(Enrollment e) {
        if (e == null) return null;
        return EnrollmentDTO.builder()
                .enrollmentId(e.getEnrollmentId())
                .empId(e.getEmpId())
                .courseId(e.getCourse() != null ? e.getCourse().getCourseId() : null)
                .enrolledAt(e.getEnrolledAt())
                .progress(e.getProgress())
                .completed(e.getCompleted())
                .score(e.getScore())
                .completedAt(e.getCompletedAt())
                .build();
    }
}

