package com.skillsphere.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;
    private String level;
    private String duration;
    private String thumbnail;
    private String trainerName;
    private double rating;
    private int enrolledCount;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Course() {}

    public Course(Long id, String title, String description, String category, String level, String duration, String thumbnail, String trainerName, double rating, int enrolledCount) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.level = level;
        this.duration = duration;
        this.thumbnail = thumbnail;
        this.trainerName = trainerName;
        this.rating = rating;
        this.enrolledCount = enrolledCount;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static CourseBuilder builder() { return new CourseBuilder(); }

    public static class CourseBuilder {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String level;
        private String duration;
        private String thumbnail;
        private String trainerName;
        private double rating;
        private int enrolledCount;

        public CourseBuilder id(Long id) { this.id = id; return this; }
        public CourseBuilder title(String title) { this.title = title; return this; }
        public CourseBuilder description(String description) { this.description = description; return this; }
        public CourseBuilder category(String category) { this.category = category; return this; }
        public CourseBuilder level(String level) { this.level = level; return this; }
        public CourseBuilder duration(String duration) { this.duration = duration; return this; }
        public CourseBuilder thumbnail(String thumbnail) { this.thumbnail = thumbnail; return this; }
        public CourseBuilder trainerName(String trainerName) { this.trainerName = trainerName; return this; }
        public CourseBuilder rating(double rating) { this.rating = rating; return this; }
        public CourseBuilder enrolledCount(int enrolledCount) { this.enrolledCount = enrolledCount; return this; }

        public Course build() {
            return new Course(id, title, description, category, level, duration, thumbnail, trainerName, rating, enrolledCount);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getEnrolledCount() { return enrolledCount; }
    public void setEnrolledCount(int enrolledCount) { this.enrolledCount = enrolledCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
