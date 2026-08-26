package com.skillsphere.dto;

import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDTO {
    private UUID assessId;
    private UUID empId;
    private Long skillId;
    private Float score;
    private Boolean passed;
    private Boolean verified;
}
