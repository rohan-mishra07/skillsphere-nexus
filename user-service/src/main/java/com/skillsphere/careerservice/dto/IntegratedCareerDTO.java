package com.skillsphere.careerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IntegratedCareerDTO {
    private UUID employeeId;
    private String targetRole;
    private Object skillGaps;
    private Object courses;
    private Object enrollments;
    private Object certifications;
}
