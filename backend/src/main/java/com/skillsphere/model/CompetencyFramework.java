package com.skillsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "competency_frameworks")
public class CompetencyFramework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roleTitle; // e.g. "Developer", "Senior Architect", "Technical Lead"
    private String department;
    private String skillCategory; // "Technical", "Domain", "Soft"
    private String requiredSkillName;
    private int targetProficiency; // 0-100 or 1-10 rating
    private String competencyLevel; // "Beginner", "Intermediate", "Advanced", "Expert"
    private String verificationRequirement; // "Certification + Assessment"

    public CompetencyFramework() {}

    public CompetencyFramework(Long id, String roleTitle, String department, String skillCategory, String requiredSkillName, int targetProficiency, String competencyLevel, String verificationRequirement) {
        this.id = id;
        this.roleTitle = roleTitle;
        this.department = department;
        this.skillCategory = skillCategory;
        this.requiredSkillName = requiredSkillName;
        this.targetProficiency = targetProficiency;
        this.competencyLevel = competencyLevel;
        this.verificationRequirement = verificationRequirement;
    }

    public static CompetencyFrameworkBuilder builder() { return new CompetencyFrameworkBuilder(); }

    public static class CompetencyFrameworkBuilder {
        private Long id;
        private String roleTitle;
        private String department;
        private String skillCategory;
        private String requiredSkillName;
        private int targetProficiency;
        private String competencyLevel;
        private String verificationRequirement;

        public CompetencyFrameworkBuilder id(Long id) { this.id = id; return this; }
        public CompetencyFrameworkBuilder roleTitle(String roleTitle) { this.roleTitle = roleTitle; return this; }
        public CompetencyFrameworkBuilder department(String department) { this.department = department; return this; }
        public CompetencyFrameworkBuilder skillCategory(String skillCategory) { this.skillCategory = skillCategory; return this; }
        public CompetencyFrameworkBuilder requiredSkillName(String requiredSkillName) { this.requiredSkillName = requiredSkillName; return this; }
        public CompetencyFrameworkBuilder targetProficiency(int targetProficiency) { this.targetProficiency = targetProficiency; return this; }
        public CompetencyFrameworkBuilder competencyLevel(String competencyLevel) { this.competencyLevel = competencyLevel; return this; }
        public CompetencyFrameworkBuilder verificationRequirement(String verificationRequirement) { this.verificationRequirement = verificationRequirement; return this; }

        public CompetencyFramework build() {
            return new CompetencyFramework(id, roleTitle, department, skillCategory, requiredSkillName, targetProficiency, competencyLevel, verificationRequirement);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoleTitle() { return roleTitle; }
    public void setRoleTitle(String roleTitle) { this.roleTitle = roleTitle; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getSkillCategory() { return skillCategory; }
    public void setSkillCategory(String skillCategory) { this.skillCategory = skillCategory; }
    public String getRequiredSkillName() { return requiredSkillName; }
    public void setRequiredSkillName(String requiredSkillName) { this.requiredSkillName = requiredSkillName; }
    public int getTargetProficiency() { return targetProficiency; }
    public void setTargetProficiency(int targetProficiency) { this.targetProficiency = targetProficiency; }
    public String getCompetencyLevel() { return competencyLevel; }
    public void setCompetencyLevel(String competencyLevel) { this.competencyLevel = competencyLevel; }
    public String getVerificationRequirement() { return verificationRequirement; }
    public void setVerificationRequirement(String verificationRequirement) { this.verificationRequirement = verificationRequirement; }
}
