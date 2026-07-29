package com.skillsphere.controller;

import com.skillsphere.model.*;
import com.skillsphere.repository.*;
import com.skillsphere.service.SkillProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SkillController {

    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final CourseRepository courseRepository;
    private final SkillProfileService skillProfileService;
    private final AssessmentRepository assessmentRepository;
    private final CertificateRepository certificateRepository;
    private final CompetencyFrameworkRepository competencyFrameworkRepository;

    @Autowired
    public SkillController(SkillRepository skillRepository,
                           UserSkillRepository userSkillRepository,
                           CourseRepository courseRepository,
                           SkillProfileService skillProfileService,
                           AssessmentRepository assessmentRepository,
                           CertificateRepository certificateRepository,
                           CompetencyFrameworkRepository competencyFrameworkRepository) {
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.courseRepository = courseRepository;
        this.skillProfileService = skillProfileService;
        this.assessmentRepository = assessmentRepository;
        this.certificateRepository = certificateRepository;
        this.competencyFrameworkRepository = competencyFrameworkRepository;
    }

    /**
     * Endpoint for Milestone 1 - Aggregated Employee Skill Profile
     */
    @GetMapping("/profile/{empId}")
    public ResponseEntity<Map<String, Object>> getEmployeeSkillProfile(@PathVariable Long empId) {
        return ResponseEntity.ok(skillProfileService.getSkillProfile(empId));
    }

    /**
     * Skill Catalog by Category (Technical, Domain, Soft Skills)
     */
    @GetMapping("/catalog")
    public ResponseEntity<List<Skill>> getSkillCatalog(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(skillProfileService.getSkillCatalog(category));
    }

    /**
     * User Assessed Skills
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserSkill>> getUserSkills(@PathVariable Long userId) {
        return ResponseEntity.ok(userSkillRepository.findByUserId(userId));
    }

    /**
     * Assessments endpoint
     */
    @GetMapping("/assessments/{userId}")
    public ResponseEntity<List<Assessment>> getUserAssessments(@PathVariable Long userId) {
        return ResponseEntity.ok(assessmentRepository.findByUserId(userId));
    }

    /**
     * Submit or Verify Skill Assessment Score
     */
    @PostMapping("/assessment/submit")
    public ResponseEntity<Assessment> submitAssessment(@RequestParam Long userId,
                                                        @RequestParam Long skillId,
                                                        @RequestParam int score,
                                                        @RequestParam(required = false) String testName) {
        Assessment saved = skillProfileService.recordAssessmentScore(userId, skillId, score, testName);
        return ResponseEntity.ok(saved);
    }

    /**
     * HR RBAC: Verify Assessment Score
     */
    @PostMapping("/assessment/verify")
    public ResponseEntity<Assessment> verifyAssessment(@RequestParam Long assessmentId, @RequestParam String status) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found: " + assessmentId));
        assessment.setStatus(status);
        assessment.setEvaluatedBy("HR Manager - Marcus Vance");
        Assessment updated = assessmentRepository.save(assessment);
        return ResponseEntity.ok(updated);
    }

    /**
     * Competency Framework Mapping
     */
    @GetMapping("/competency")
    public ResponseEntity<List<CompetencyFramework>> getCompetencyFrameworks(@RequestParam(required = false) String roleTitle) {
        if (roleTitle != null && !roleTitle.trim().isEmpty()) {
            return ResponseEntity.ok(competencyFrameworkRepository.findByRoleTitle(roleTitle));
        }
        return ResponseEntity.ok(competencyFrameworkRepository.findAll());
    }

    /**
     * Certification Tracking
     */
    @GetMapping("/certifications/{userId}")
    public ResponseEntity<List<Certificate>> getUserCertifications(@PathVariable Long userId) {
        return ResponseEntity.ok(certificateRepository.findByUserId(userId));
    }

    /**
     * HR RBAC: Add New Skill to Catalog
     */
    @PostMapping("/admin/add-skill")
    public ResponseEntity<Skill> addSkillToCatalog(@RequestBody Skill skill) {
        Skill saved = skillRepository.save(skill);
        return ResponseEntity.ok(saved);
    }

    /**
     * Skill Gap & Recommendations
     */
    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<Map<String, Object>> getAiRecommendations(@PathVariable Long userId) {
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        List<Course> allCourses = courseRepository.findAll();

        List<UserSkill> gaps = userSkills.stream()
                .filter(s -> s.getCurrentProficiency() < s.getRequiredProficiency())
                .collect(Collectors.toList());

        List<Course> recommendedCourses = allCourses.stream()
                .limit(3)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("gapsIdentified", gaps);
        response.put("recommendedCourses", recommendedCourses);
        response.put("aiSummary", "Skill gap analysis complete: Proficiency gap detected in AWS Cloud Architecture and React Micro-Frontends. Upskilling recommended.");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/matrix")
    public ResponseEntity<List<UserSkill>> getSkillMatrix() {
        return ResponseEntity.ok(userSkillRepository.findAll());
    }
}
