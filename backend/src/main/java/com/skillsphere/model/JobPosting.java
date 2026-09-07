package com.skillsphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_postings")
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String department;
    private String location;
    private String type;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String status;
    private int applicantCount;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public JobPosting() {}

    public JobPosting(Long id, String title, String department, String location, String type, String description, String status, int applicantCount) {
        this.id = id;
        this.title = title;
        this.department = department;
        this.location = location;
        this.type = type;
        this.description = description;
        this.status = status;
        this.applicantCount = applicantCount;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static JobPostingBuilder builder() { return new JobPostingBuilder(); }

    public static class JobPostingBuilder {
        private Long id;
        private String title;
        private String department;
        private String location;
        private String type;
        private String description;
        private String status;
        private int applicantCount;

        public JobPostingBuilder id(Long id) { this.id = id; return this; }
        public JobPostingBuilder title(String title) { this.title = title; return this; }
        public JobPostingBuilder department(String department) { this.department = department; return this; }
        public JobPostingBuilder location(String location) { this.location = location; return this; }
        public JobPostingBuilder type(String type) { this.type = type; return this; }
        public JobPostingBuilder description(String description) { this.description = description; return this; }
        public JobPostingBuilder status(String status) { this.status = status; return this; }
        public JobPostingBuilder applicantCount(int applicantCount) { this.applicantCount = applicantCount; return this; }

        public JobPosting build() {
            return new JobPosting(id, title, department, location, type, description, status, applicantCount);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getApplicantCount() { return applicantCount; }
    public void setApplicantCount(int applicantCount) { this.applicantCount = applicantCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
