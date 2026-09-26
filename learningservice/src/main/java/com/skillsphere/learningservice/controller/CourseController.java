package com.skillsphere.learningservice.controller;

import com.skillsphere.learningservice.dto.CourseDTO;
import com.skillsphere.learningservice.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for course management — Milestone 2 Learning Service.
 *
 * <p>Role boundaries (evaluated against the {@code "role"} claim in the
 * incoming JWT by {@code @EnableMethodSecurity}):
 * <table>
 *   <tr><th>Method</th><th>Allowed roles</th><th>Rationale</th></tr>
 *   <tr><td>GET  /api/learning/courses</td>
 *       <td>ADMIN, TRAINER, MANAGER, EMPLOYEE, HR, STUDENT</td>
 *       <td>All authenticated employees may browse the catalogue.</td></tr>
 *   <tr><td>GET  /api/learning/courses/{id}</td>
 *       <td>ADMIN, TRAINER, MANAGER, EMPLOYEE, HR, STUDENT</td>
 *       <td>Same as above — read-only.</td></tr>
 *   <tr><td>POST /api/learning/courses</td>
 *       <td>ADMIN, TRAINER</td>
 *       <td>Only training staff may create new courses.</td></tr>
 *   <tr><td>PUT  /api/learning/courses/{id}</td>
 *       <td>ADMIN, TRAINER</td>
 *       <td>Only training staff may update course content.</td></tr>
 *   <tr><td>DELETE /api/learning/courses/{id}</td>
 *       <td>ADMIN</td>
 *       <td>Hard deletes are an admin-only destructive action.</td></tr>
 * </table>
 * Unauthorised callers receive {@code HTTP 403 Forbidden} automatically.
 * </p>
 */
@RestController
@RequestMapping("/api/learning/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseController {

    private final CourseService courseService;

    // ── Read endpoints ────────────────────────────────────────────────────────

    /**
     * Returns all published courses.
     * Accessible by every authenticated role — employees need to browse
     * the catalogue to self-enroll.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MANAGER', 'EMPLOYEE', 'HR', 'STUDENT')")
    public List<CourseDTO> getAllCourses() {
        return courseService.getAllCourses();
    }

    /**
     * Returns a single course by ID.
     * Same broad read access as the list endpoint.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MANAGER', 'EMPLOYEE', 'HR', 'STUDENT')")
    public CourseDTO getCourse(@PathVariable UUID id) {
        return courseService.getCourse(id);
    }

    // ── Write endpoints ───────────────────────────────────────────────────────

    /**
     * Creates a new course.
     * Restricted to ADMIN and TRAINER (training managers).
     * Non-authorised callers receive {@code 403 Forbidden}.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public CourseDTO createCourse(@RequestBody CourseDTO dto) {
        return courseService.createCourse(dto);
    }

    /**
     * Updates an existing course (full or partial update via PUT).
     * Restricted to ADMIN and TRAINER.
     * Employees attempting this endpoint receive {@code 403 Forbidden}.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public CourseDTO updateCourse(@PathVariable UUID id, @RequestBody CourseDTO dto) {
        return courseService.updateCourse(id, dto);
    }

    /**
     * Deletes a course.  Destructive — restricted to ADMIN only.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteCourse(@PathVariable UUID id) {
        courseService.deleteCourse(id);
    }
}

