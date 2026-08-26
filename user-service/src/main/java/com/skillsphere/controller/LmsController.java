package com.skillsphere.controller;

import com.skillsphere.model.Certificate;
import com.skillsphere.model.Course;
import com.skillsphere.model.Lesson;
import com.skillsphere.repository.CertificateRepository;
import com.skillsphere.repository.CourseRepository;
import com.skillsphere.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lms")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LmsController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable UUID id) {
        return ResponseEntity.of(courseRepository.findById(id));
    }

    @PostMapping("/courses")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course saved = courseRepository.save(course);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable UUID courseId) {
        return ResponseEntity.ok(lessonRepository.findByCourseIdOrderBySequenceOrderAsc(courseId));
    }

    @PostMapping("/certificates/issue")
    public ResponseEntity<Certificate> issueCertificate(@RequestParam Long userId, @RequestParam String userName, @RequestParam UUID courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        String courseTitle = course != null ? course.getTitle() : "SkillSphere Certified Course";

        Certificate cert = Certificate.builder()
                .userId(userId)
                .userName(userName)
                .courseId(courseId)
                .courseTitle(courseTitle)
                .certificateCode("SKSP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .issueDate(java.time.LocalDate.now().toString())
                .build();

        Certificate saved = certificateRepository.save(cert);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/certificates/user/{userId}")
    public ResponseEntity<List<Certificate>> getUserCertificates(@PathVariable Long userId) {
        return ResponseEntity.ok(certificateRepository.findByUserId(userId));
    }
}
