package com.skillsphere.careerservice.dto;

import lombok.*;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerPlanDTO {
    private UUID planId;
    private UUID empId;
    private String employeeName;
    private String currentRole;
    private String targetRole;
    private Integer progress;
    private String mentor;
    private String employeeSkills;
    private String skillGaps;
    private String trainingPlan;
    private Integer promotionScore;
    private Boolean promotionEligible;
    private String status;
    private String lastAutoUpdate;
}
