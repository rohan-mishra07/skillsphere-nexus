package com.skillsphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private String certificateCode; // e.g. "AWS SAA", "Java OCP"
    private String issueDate;
    private String expiryDate;
    private String status; // "VALID", "EXPIRED", "RENEWAL_REQUIRED"
    private String issuingAuthority; // "AWS", "Oracle", "SkillSphere Academy"
    private boolean verified;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Certificate() {}

    public Certificate(Long id, Long userId, String userName, Long courseId, String courseTitle, String certificateCode, String issueDate, String expiryDate, String status, String issuingAuthority, boolean verified) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.certificateCode = certificateCode;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.status = status;
        this.issuingAuthority = issuingAuthority;
        this.verified = verified;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static CertificateBuilder builder() { return new CertificateBuilder(); }

    public static class CertificateBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private Long courseId;
        private String courseTitle;
        private String certificateCode;
        private String issueDate;
        private String expiryDate;
        private String status = "VALID";
        private String issuingAuthority;
        private boolean verified = true;

        public CertificateBuilder id(Long id) { this.id = id; return this; }
        public CertificateBuilder userId(Long userId) { this.userId = userId; return this; }
        public CertificateBuilder userName(String userName) { this.userName = userName; return this; }
        public CertificateBuilder courseId(Long courseId) { this.courseId = courseId; return this; }
        public CertificateBuilder courseTitle(String courseTitle) { this.courseTitle = courseTitle; return this; }
        public CertificateBuilder certificateCode(String certificateCode) { this.certificateCode = certificateCode; return this; }
        public CertificateBuilder issueDate(String issueDate) { this.issueDate = issueDate; return this; }
        public CertificateBuilder expiryDate(String expiryDate) { this.expiryDate = expiryDate; return this; }
        public CertificateBuilder status(String status) { this.status = status; return this; }
        public CertificateBuilder issuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; return this; }
        public CertificateBuilder verified(boolean verified) { this.verified = verified; return this; }

        public Certificate build() {
            return new Certificate(id, userId, userName, courseId, courseTitle, certificateCode, issueDate, expiryDate, status, issuingAuthority, verified);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }
    public String getCertificateCode() { return certificateCode; }
    public void setCertificateCode(String certificateCode) { this.certificateCode = certificateCode; }
    public String getIssueDate() { return issueDate; }
    public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    public String getExpiryDate() { return expiryDate; }
    public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getIssuingAuthority() { return issuingAuthority; }
    public void setIssuingAuthority(String issuingAuthority) { this.issuingAuthority = issuingAuthority; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
