package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.EnrollmentDTO;
import com.skillsphere.learningservice.entity.Course;
import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.repository.CourseRepository;
import com.skillsphere.learningservice.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service("learningEnrollmentService")
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentDTO enroll(UUID empId, UUID courseId) {
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

        return toDTO(enrollmentRepository.save(enrollment));
    }

    public List<EnrollmentDTO> getEmployeeEnrollments(UUID empId) {
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

    public EnrollmentDTO getEnrollmentById(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));
        return toDTO(enrollment);
    }

    public EnrollmentDTO updateProgress(UUID enrollmentId, Integer progress, Float score) {
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

        return toDTO(enrollmentRepository.save(enrollment));
    }

    private EnrollmentDTO toDTO(Enrollment e) {
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
