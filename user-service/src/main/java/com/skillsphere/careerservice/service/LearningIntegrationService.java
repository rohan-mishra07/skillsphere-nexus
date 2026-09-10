package com.skillsphere.careerservice.service;

import com.skillsphere.repository.CourseRepository;
import com.skillsphere.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LearningIntegrationService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public Object getCourses() {
        return courseRepository.findAll();
    }

    public Object getEnrollments(UUID empId) {
        return enrollmentRepository.findByEmpId(empId);
    }
}
