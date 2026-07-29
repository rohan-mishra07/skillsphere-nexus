package com.skillsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applicants")
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private String jobTitle;
    private String candidateName;
    private String candidateEmail;
    private String phone;
    private String resumeUrl;
    private String stage;
    private int matchScore;

    public Applicant() {}

    public Applicant(Long id, Long jobId, String jobTitle, String candidateName, String candidateEmail, String phone, String resumeUrl, String stage, int matchScore) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.phone = phone;
        this.resumeUrl = resumeUrl;
        this.stage = stage;
        this.matchScore = matchScore;
    }

    public static ApplicantBuilder builder() { return new ApplicantBuilder(); }

    public static class ApplicantBuilder {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private String candidateName;
        private String candidateEmail;
        private String phone;
        private String resumeUrl;
        private String stage;
        private int matchScore;

        public ApplicantBuilder id(Long id) { this.id = id; return this; }
        public ApplicantBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public ApplicantBuilder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public ApplicantBuilder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
        public ApplicantBuilder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public ApplicantBuilder phone(String phone) { this.phone = phone; return this; }
        public ApplicantBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public ApplicantBuilder stage(String stage) { this.stage = stage; return this; }
        public ApplicantBuilder matchScore(int matchScore) { this.matchScore = matchScore; return this; }

        public Applicant build() {
            return new Applicant(id, jobId, jobTitle, candidateName, candidateEmail, phone, resumeUrl, stage, matchScore);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }
}
