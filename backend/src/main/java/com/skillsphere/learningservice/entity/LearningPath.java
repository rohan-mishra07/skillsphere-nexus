package com.skillsphere.learningservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity(name = "LearningLearningPath")
@Table(name = "learning_paths")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPath {

    @Id
    @GeneratedValue
    private UUID pathId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String targetRole;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "lms_learning_path_courses",
            joinColumns = @JoinColumn(name = "path_id", referencedColumnName = "pathId"),
            inverseJoinColumns = @JoinColumn(name = "course_id", referencedColumnName = "courseId")
    )
    @Builder.Default
    private List<Course> courses = new ArrayList<>();
}
