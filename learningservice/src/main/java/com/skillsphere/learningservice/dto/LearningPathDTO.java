package com.skillsphere.learningservice.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPathDTO {
    private UUID pathId;
    private String title;
    private String description;
    private String targetRole;
    private List<CourseDTO> courses;
    private List<UUID> courseIds;
}
