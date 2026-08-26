package com.skillsphere.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseContentDTO {
    private UUID contentId;
    private UUID courseId;
    private String title;
    private String contentType;
    private String urlOrData;
    private Integer sequenceOrder;
}
