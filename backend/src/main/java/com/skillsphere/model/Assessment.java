package com.skillsphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private Long skillId;
    private String skillName;
    private int score; // e.g. 87%
    private String status; // "VERIFIED", "PENDING", "COMPLETED"
    private String testName;
    private String evaluatedBy;
    private String testDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Assessment() {}

    public Assessment(Long id, Long userId, String userName, Long skillId, String skillName, int score, String status, String testName, String evaluatedBy, String testDate) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.skillId = skillId;
        this.skillName = skillName;
        this.score = score;
        this.status = status;
        this.testName = testName;
        this.evaluatedBy = evaluatedBy;
        this.testDate = testDate;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static AssessmentBuilder builder() { return new AssessmentBuilder(); }

    public static class AssessmentBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private Long skillId;
        private String skillName;
        private int score;
        private String status;
        private String testName;
        private String evaluatedBy;
        private String testDate;

        public AssessmentBuilder id(Long id) { this.id = id; return this; }
        public AssessmentBuilder userId(Long userId) { this.userId = userId; return this; }
        public AssessmentBuilder userName(String userName) { this.userName = userName; return this; }
        public AssessmentBuilder skillId(Long skillId) { this.skillId = skillId; return this; }
        public AssessmentBuilder skillName(String skillName) { this.skillName = skillName; return this; }
        public AssessmentBuilder score(int score) { this.score = score; return this; }
        public AssessmentBuilder status(String status) { this.status = status; return this; }
        public AssessmentBuilder testName(String testName) { this.testName = testName; return this; }
        public AssessmentBuilder evaluatedBy(String evaluatedBy) { this.evaluatedBy = evaluatedBy; return this; }
        public AssessmentBuilder testDate(String testDate) { this.testDate = testDate; return this; }

        public Assessment build() {
            return new Assessment(id, userId, userName, skillId, skillName, score, status, testName, evaluatedBy, testDate);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getEvaluatedBy() { return evaluatedBy; }
    public void setEvaluatedBy(String evaluatedBy) { this.evaluatedBy = evaluatedBy; }
    public String getTestDate() { return testDate; }
    public void setTestDate(String testDate) { this.testDate = testDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
