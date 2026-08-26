package com.skillsphere.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDto {
    private UUID empId;
    private Long id;
    private String name;
    private String email;
    private String role;
    private String department;
    private String designation;
    private List<SkillCompetencyDto> skills;
}
