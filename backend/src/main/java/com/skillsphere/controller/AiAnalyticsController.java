package com.skillsphere.controller;

import com.skillsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiAnalyticsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicantRepository applicantRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        metrics.put("totalEmployees", userRepository.count());
        metrics.put("activeCourses", courseRepository.count());
        metrics.put("certificatesIssued", certificateRepository.count());
        metrics.put("activeJobOpenings", jobPostingRepository.count());
        metrics.put("totalApplicants", applicantRepository.count());
        metrics.put("averageCourseCompletionRate", "88.4%");
        metrics.put("workforceProductivityIndex", "92.1%");
        metrics.put("skillGapClosureRate", "+14.8%");

        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/ai-chatbot")
    public ResponseEntity<Map<String, Object>> chatWithAi(@RequestBody Map<String, String> request) {
        String prompt = request.getOrDefault("prompt", "").trim().toLowerCase();
        String response;
        String actionLink = null;
        String actionLabel = null;

        if (prompt.contains("course") || prompt.contains("learn") || prompt.contains("lms") || prompt.contains("module")) {
            response = "SkillSphere AI recommends completing 'Enterprise Java Spring Boot 3 & Security' and 'React 18 & Modern Tailwind CSS Enterprise UI' to elevate your technical proficiency index to 90%+.";
            actionLink = "/courses";
            actionLabel = "Browse LMS Courses";
        } else if (prompt.contains("gap") || prompt.contains("skill") || prompt.contains("matrix") || prompt.contains("test") || prompt.contains("assessment")) {
            response = "Your latest AI Skill Gap Analysis detected a 20% gap in React Micro-Frontends & Spring Security Filter Chains. Taking a 5-minute skill assessment will update your team matrix.";
            actionLink = "/skills";
            actionLabel = "Open Skill Matrix & Gap Analysis";
        } else if (prompt.contains("leave") || prompt.contains("vacation") || prompt.contains("holiday") || prompt.contains("sick") || prompt.contains("time off")) {
            response = "You can log Annual, Casual, or Sick Leave in the Workforce Planner. Your manager (Elena Rostova) and HR (Marcus Vance) will receive an automated approval notification.";
            actionLink = "/workforce";
            actionLabel = "Apply for Leave";
        } else if (prompt.contains("clock") || prompt.contains("shift") || prompt.contains("attendance") || prompt.contains("time")) {
            response = "Your current shift is Morning Shift (09:00 - 17:00). You can log your daily attendance check-in and check-out on your Employee Dashboard or Workforce Planner.";
            actionLink = "/workforce";
            actionLabel = "View Shift Schedule";
        } else if (prompt.contains("certificate") || prompt.contains("completion") || prompt.contains("cert")) {
            response = "Digital Certificates are automatically issued upon reaching 100% course lecture completion. You can download verified HTML5/PDF certificates with unique verification codes (e.g. SKSP-89F2A90C).";
            actionLink = "/courses";
            actionLabel = "View My Certificates";
        } else if (prompt.contains("okr") || prompt.contains("goal") || prompt.contains("kpi") || prompt.contains("performance") || prompt.contains("review")) {
            response = "Your Q3 OKR Goal 'Complete Microservices Migration Phase 1' is at 75% progress. Your manager posted 360-degree feedback: 'Great progress on security filters.'";
            actionLink = "/performance";
            actionLabel = "View OKR & KPI Progress";
        } else if (prompt.contains("job") || prompt.contains("hire") || prompt.contains("applicant") || prompt.contains("candidate") || prompt.contains("recruitment") || prompt.contains("ats")) {
            response = "There is 1 active job requisition: 'Senior Cloud Backend Architect' with 14 applicants in the ATS Kanban pipeline. Candidate Jordan Rivera has a 94% AI match score.";
            actionLink = "/recruitment";
            actionLabel = "Open Recruitment ATS Board";
        } else if (prompt.contains("career") || prompt.contains("promotion") || prompt.contains("path") || prompt.contains("salary")) {
            response = "Based on your current skill matrix (Java: 88%, React: 65%), your recommended career progression is Senior Full-Stack Architect within 12 months.";
            actionLink = "/skills";
            actionLabel = "View Career Progression Matrix";
        } else {
            response = "I am your SkillSphere AI Copilot. I can assist you with course recommendations, skill gap analysis, leave policies, attendance clock-ins, performance OKRs, and recruitment pipelines!";
            actionLink = "/";
            actionLabel = "Go to System Overview";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("response", response);
        if (actionLink != null) {
            result.put("actionLink", actionLink);
            result.put("actionLabel", actionLabel);
        }

        return ResponseEntity.ok(result);
    }
}
