package com.skillsphere.learningservice.config;

import com.skillsphere.learningservice.entity.*;
import com.skillsphere.learningservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

        private final CourseRepository courseRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final LearningPathRepository learningPathRepository;
        private final CourseContentRepository courseContentRepository;
        private final AssessmentResultRepository assessmentResultRepository;
        private final LmsCertificateRepository certificateRepository;

        @Override
        public void run(String... args) throws Exception {
                if (courseRepository.count() > 0) {
                        return;
                }

                System.out.println("--> Seeding SkillSphere Learning Service Initial Data (Milestone 2)...");

                // 1. Seed Courses
                Course course1 = Course.builder()
                                .title("Enterprise Java Spring Boot 4 & Security")
                                .description("Master modern Spring Boot 4 RESTful APIs, Spring Security with JWT tokens, Spring Data JPA, and Microservices Architecture.")
                                .duration(12)
                                .type(Course.CourseType.ONLINE)
                                .instructor("Prof. David Sterling")
                                .rating(4.9)
                                .active(true)
                                .build();

                Course course2 = Course.builder()
                                .title("React 18 & Modern Web Enterprise UI")
                                .description("Build high-performance web applications using React hooks, dynamic routing, state management, and enterprise design systems.")
                                .duration(10)
                                .type(Course.CourseType.WORKSHOP)
                                .instructor("Prof. David Sterling")
                                .rating(4.85)
                                .active(true)
                                .build();

                Course course3 = Course.builder()
                                .title("AWS Certified Solutions Architect & Cloud Native Strategy")
                                .description("Designing fault-tolerant, highly available enterprise microservices on AWS Cloud infrastructure.")
                                .duration(15)
                                .type(Course.CourseType.BOOTCAMP)
                                .instructor("Elena Rostova")
                                .rating(4.95)
                                .active(true)
                                .build();

                courseRepository.saveAll(Objects.requireNonNull(Arrays.asList(course1, course2, course3)));

                // 2. Seed Enrollments
                UUID emp1 = UUID.fromString("11111111-1111-1111-1111-111111111111");
                UUID emp2 = UUID.fromString("e1002000-0000-0000-0000-000000000002");
                UUID targetEnrollmentId = UUID.fromString("99a3c9cd-da43-4f68-9b9f-8ec9df2b48ca");

                Enrollment enr1 = Enrollment.builder()
                                .enrollmentId(targetEnrollmentId)
                                .empId(emp1)
                                .course(course1)
                                .enrolledAt(LocalDateTime.now().minusDays(20))
                                .progress(100)
                                .completed(true)
                                .score(90.0f)
                                .completedAt(LocalDateTime.now().minusDays(2))
                                .build();

                Enrollment enr2 = Enrollment.builder()
                                .empId(emp1)
                                .course(course2)
                                .enrolledAt(LocalDateTime.now().minusDays(10))
                                .progress(65)
                                .completed(false)
                                .score(0.0f)
                                .build();

                Enrollment enr3 = Enrollment.builder()
                                .empId(emp2)
                                .course(course3)
                                .enrolledAt(LocalDateTime.now().minusDays(5))
                                .progress(100)
                                .completed(true)
                                .score(92.5f)
                                .completedAt(LocalDateTime.now().minusDays(1))
                                .build();

                enrollmentRepository.saveAll(Objects.requireNonNull(Arrays.asList(enr1, enr2, enr3)));

                // 3. Seed Learning Paths
                LearningPath path1 = LearningPath.builder()
                                .title("Full-Stack Java Enterprise Architect")
                                .description("Comprehensive career track from Core Java to Spring Boot 4 Microservices")
                                .targetRole("Solutions Architect")
                                .courses(Arrays.asList(course1, course2))
                                .build();

                learningPathRepository.save(Objects.requireNonNull(path1));

                // 4. Seed Course Content
                CourseContent content1 = CourseContent.builder()
                                .course(course1)
                                .title("Lesson 1: Spring Boot 4 Core Architecture & Beans")
                                .contentType("VIDEO")
                                .urlOrData("https://learning.skillsphere.com/lessons/springboot4-intro")
                                .sequenceOrder(1)
                                .build();

                courseContentRepository.save(Objects.requireNonNull(content1));

                // 5. Seed Assessment Result
                AssessmentResult ass1 = AssessmentResult.builder()
                                .empId(emp1)
                                .courseId(course1.getCourseId())
                                .enrollmentId(targetEnrollmentId)
                                .score(90.0f)
                                .resultStatus("PASSED")
                                .assessedAt(LocalDateTime.now().minusDays(2))
                                .build();

                assessmentResultRepository.save(Objects.requireNonNull(ass1));

                // 6. Seed Certificate for Completed Enrollment
                Certificate cert1 = Certificate.builder()
                                .empId(emp1)
                                .courseId(course1.getCourseId())
                                .enrollmentId(targetEnrollmentId)
                                .certificateNumber("CERT-SKSP-5B916935")
                                .issuedAt(LocalDateTime.now().minusDays(2))
                                .status("ISSUED")
                                .build();

                certificateRepository.save(Objects.requireNonNull(cert1));

                System.out.println("--> SkillSphere Learning Service Data Initialized Successfully on Port 8082!");
        }
}

