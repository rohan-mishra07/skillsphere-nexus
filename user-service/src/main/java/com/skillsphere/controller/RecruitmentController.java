package com.skillsphere.controller;

import com.skillsphere.model.Applicant;
import com.skillsphere.model.JobPosting;
import com.skillsphere.repository.ApplicantRepository;
import com.skillsphere.repository.JobPostingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RecruitmentController {

    @Autowired
    private JobPostingRepository jobPostingRepository;

    @Autowired
    private ApplicantRepository applicantRepository;

    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> getJobPostings() {
        return ResponseEntity.ok(jobPostingRepository.findAll());
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobPosting> createJobPosting(@RequestBody JobPosting job) {
        job.setStatus("Active");
        return ResponseEntity.ok(jobPostingRepository.save(job));
    }

    @GetMapping("/applicants")
    public ResponseEntity<List<Applicant>> getAllApplicants() {
        return ResponseEntity.ok(applicantRepository.findAll());
    }

    @PostMapping("/applicants")
    public ResponseEntity<Applicant> applyForJob(@RequestBody Applicant applicant) {
        if (applicant.getStage() == null) applicant.setStage("Applied");
        if (applicant.getMatchScore() == 0) applicant.setMatchScore((int) (Math.random() * 30 + 70));

        Applicant saved = applicantRepository.save(applicant);

        // increment applicant count on job
        jobPostingRepository.findById(applicant.getJobId()).ifPresent(job -> {
            job.setApplicantCount(job.getApplicantCount() + 1);
            jobPostingRepository.save(job);
        });

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/applicants/{id}/stage")
    public ResponseEntity<Applicant> updateStage(@PathVariable Long id, @RequestParam String stage) {
        return applicantRepository.findById(id).map(app -> {
            app.setStage(stage);
            return ResponseEntity.ok(applicantRepository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }
}
