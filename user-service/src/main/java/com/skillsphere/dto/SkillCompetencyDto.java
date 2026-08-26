package com.skillsphere.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillCompetencyDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private Integer currentProficiency;
    private Integer targetProficiency;
    private String status;
}
