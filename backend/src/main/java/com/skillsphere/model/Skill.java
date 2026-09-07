package com.skillsphere.model;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID skillId;

    @Column(nullable = false, unique = true)
    private String name;

    private String category;
    private String description;

    public Skill() {}

    public Skill(Long id, UUID skillId, String name, String category, String description) {
        this.id = id;
        this.skillId = skillId;
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public static SkillBuilder builder() { return new SkillBuilder(); }

    public static class SkillBuilder {
        private Long id;
        private UUID skillId;
        private String name;
        private String category;
        private String description;

        public SkillBuilder id(Long id) { this.id = id; return this; }
        public SkillBuilder skillId(UUID skillId) { this.skillId = skillId; return this; }
        public SkillBuilder name(String name) { this.name = name; return this; }
        public SkillBuilder category(String category) { this.category = category; return this; }
        public SkillBuilder description(String description) { this.description = description; return this; }

        public Skill build() {
            return new Skill(id, skillId, name, category, description);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UUID getSkillId() {
        if (skillId == null && name != null) {
            skillId = UUID.nameUUIDFromBytes(name.getBytes());
        }
        return skillId;
    }
    public void setSkillId(UUID skillId) { this.skillId = skillId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public enum Category {
        TECHNICAL, DOMAIN, SOFT_SKILLS, LEADERSHIP, DEVOPS;

        public static Category fromString(String val) {
            if (val == null) return TECHNICAL;
            try {
                return Category.valueOf(val.toUpperCase().replace(" ", "_"));
            } catch (Exception e) {
                return TECHNICAL;
            }
        }
    }
}
