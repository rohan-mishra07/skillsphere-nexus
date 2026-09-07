package com.skillsphere.careerservice.dto;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private UUID jobId;
    private String title;
    private String department;
    private String requiredSkills;
    private Integer minimumExperience;
    private Boolean active;
}
