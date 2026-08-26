package com.skillsphere.learningservice.entity;

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

    private String contentType; // VIDEO, DOCUMENT, LINK, LESSON

    @Column(columnDefinition = "TEXT")
    private String urlOrData;

    private Integer sequenceOrder;
}
