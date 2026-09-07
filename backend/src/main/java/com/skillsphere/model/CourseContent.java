package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "course_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseContent {

    @Id
    @GeneratedValue
    private UUID contentId;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false)
    private String title;

    private String contentType; // LESSON, VIDEO, DOCUMENT, MATERIAL

    @Column(columnDefinition = "TEXT")
    private String urlOrData;

    private Integer sequenceOrder;
}
