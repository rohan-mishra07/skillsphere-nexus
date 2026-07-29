package com.skillsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_skills")
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long skillId;
    private String skillName;
    private String category; // "Technical", "Domain", "Soft"
    
    private int currentProficiency; // 0-100%
    private int requiredProficiency; // 0-100%
    private int ratingScore; // out of 10 (e.g. 8 for Java 8/10)
    private String level; // "Beginner", "Intermediate", "Advanced", "Expert"
    private boolean verified;

    public UserSkill() {}

    public UserSkill(Long id, Long userId, Long skillId, String skillName, String category, int currentProficiency, int requiredProficiency, int ratingScore, String level, boolean verified) {
        this.id = id;
        this.userId = userId;
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.currentProficiency = currentProficiency;
        this.requiredProficiency = requiredProficiency;
        this.ratingScore = ratingScore;
        this.level = level;
        this.verified = verified;
    }

    public static UserSkillBuilder builder() { return new UserSkillBuilder(); }

    public static class UserSkillBuilder {
        private Long id;
        private Long userId;
        private Long skillId;
        private String skillName;
        private String category;
        private int currentProficiency;
        private int requiredProficiency;
        private int ratingScore;
        private String level;
        private boolean verified = true;

        public UserSkillBuilder id(Long id) { this.id = id; return this; }
        public UserSkillBuilder userId(Long userId) { this.userId = userId; return this; }
        public UserSkillBuilder skillId(Long skillId) { this.skillId = skillId; return this; }
        public UserSkillBuilder skillName(String skillName) { this.skillName = skillName; return this; }
        public UserSkillBuilder category(String category) { this.category = category; return this; }
        public UserSkillBuilder currentProficiency(int currentProficiency) { this.currentProficiency = currentProficiency; return this; }
        public UserSkillBuilder requiredProficiency(int requiredProficiency) { this.requiredProficiency = requiredProficiency; return this; }
        public UserSkillBuilder ratingScore(int ratingScore) { this.ratingScore = ratingScore; return this; }
        public UserSkillBuilder level(String level) { this.level = level; return this; }
        public UserSkillBuilder verified(boolean verified) { this.verified = verified; return this; }

        public UserSkill build() {
            return new UserSkill(id, userId, skillId, skillName, category, currentProficiency, requiredProficiency, ratingScore, level, verified);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getCurrentProficiency() { return currentProficiency; }
    public void setCurrentProficiency(int currentProficiency) { this.currentProficiency = currentProficiency; }
    public int getRequiredProficiency() { return requiredProficiency; }
    public void setRequiredProficiency(int requiredProficiency) { this.requiredProficiency = requiredProficiency; }
    public int getRatingScore() { return ratingScore; }
    public void setRatingScore(int ratingScore) { this.ratingScore = ratingScore; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
