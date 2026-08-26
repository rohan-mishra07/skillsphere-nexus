package com.skillsphere.learningservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue
    private UUID courseId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer duration;

    @Enumerated(EnumType.STRING)
    private CourseType type;

    private String instructor;

    private Double rating;

    private Boolean active;

    public enum CourseType {
        ONLINE, WORKSHOP, WEBINAR, BOOTCAMP
    }

    public UUID getId() {
        return courseId;
    }
}
