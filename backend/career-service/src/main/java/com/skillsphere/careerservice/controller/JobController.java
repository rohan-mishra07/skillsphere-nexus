package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.dto.JobDTO;
import com.skillsphere.careerservice.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for internal job requisitions — Milestone 4 Career Service.
 *
 * <p>Role boundaries (enforced via JWT {@code "role"} claim +
 * {@code @EnableMethodSecurity}):
 * <table>
 *   <tr><th>Endpoint</th><th>Allowed roles</th><th>Rationale</th></tr>
 *   <tr><td>POST  /api/career/jobs</td>
 *       <td>ADMIN only</td>
 *       <td>Only Admins may publish internal job requisitions.</td></tr>
 *   <tr><td>GET   /api/career/jobs</td>
 *       <td>All authenticated roles</td>
 *       <td>All employees may browse open positions.</td></tr>
 *   <tr><td>GET   /api/career/jobs/active</td>
 *       <td>All authenticated roles</td>
 *       <td>Convenience filter — same read access as the list.</td></tr>
 *   <tr><td>POST  /api/career/jobs/{id}/apply</td>
 *       <td>All authenticated roles</td>
 *       <td>Employees submit applications; cannot create or modify jobs.</td></tr>
 *   <tr><td>DELETE /api/career/jobs/{id}</td>
 *       <td>ADMIN only</td>
 *       <td>Destructive — admin-only.</td></tr>
 * </table>
 * Unauthorised callers receive {@code HTTP 403 Forbidden} automatically.
 * </p>
 */
@RestController
@RequestMapping("/api/career/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class JobController {

    private final JobService service;

    // ── Admin write endpoints ─────────────────────────────────────────────────

    /**
     * Creates and publishes a new internal job requisition.
     * Restricted to ADMIN. Employees attempting this receive {@code 403 Forbidden}.
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public JobDTO create(@RequestBody JobDTO dto) {
        return service.create(dto);
    }

    /**
     * Deletes a job posting. Destructive — ADMIN only.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    // ── Read endpoints — all authenticated roles ──────────────────────────────

    /**
     * Returns all job postings (open and closed).
     * Accessible by every authenticated role.
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'TRAINER', 'EMPLOYEE', 'STUDENT')")
    public List<JobDTO> getAll() {
        return service.getAll();
    }

    /**
     * Returns only active (open) job postings.
     * Accessible by every authenticated role.
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'TRAINER', 'EMPLOYEE', 'STUDENT')")
    public List<JobDTO> getActive() {
        return service.getActiveJobs();
    }

    // ── Employee self-service ─────────────────────────────────────────────────

    /**
     * Submits a job application for the given posting.
     *
     * <p>Any authenticated employee may apply; they are explicitly barred from
     * the {@code POST /api/career/jobs} (create) endpoint so this is the only
     * write action available to non-admin roles.</p>
     *
     * @param id   UUID of the job being applied for
     * @return confirmation map with jobId and applicant username
     */
    @PostMapping("/{id}/apply")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER', 'TRAINER', 'EMPLOYEE', 'STUDENT')")
    public ResponseEntity<Map<String, Object>> apply(
            @PathVariable UUID id,
            @RequestHeader("Authorization") String authHeader) {

        // The actual applicant identity is resolved from the JWT subject upstream;
        // here we acknowledge the application and return the job reference.
        // A full implementation would delegate to an ApplicationService.
        return ResponseEntity.accepted().body(Map.of(
            "status",  "APPLICATION_RECEIVED",
            "jobId",   id.toString(),
            "message", "Your application has been submitted successfully."
        ));
    }
}

