package com.skillsphere.dto;

import lombok.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDTO {
    private Long id;
    private UUID skillId;
    private String name;
    private String category;
    private String description;
}
