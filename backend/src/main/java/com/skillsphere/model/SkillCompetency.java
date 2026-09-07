package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "skill_competencies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillCompetency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private UUID employeeEmpId;

    private Long skillId;
    private String skillName;
    private String category;

    private Integer currentProficiency;
    private Integer targetProficiency;
    private String competencyLevel;
}
