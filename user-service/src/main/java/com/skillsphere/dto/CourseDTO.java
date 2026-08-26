package com.skillsphere.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private UUID courseId;
    private String title;
    private String description;
    private Integer duration;
    private String type;
    private String instructor;
    private Double rating;
    private Boolean active;
}
