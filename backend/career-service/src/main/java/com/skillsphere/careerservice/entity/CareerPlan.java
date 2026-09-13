package com.skillsphere.careerservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "career_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID planId;

    @Column(nullable = false)
    private UUID empId;

    private String employeeName;

    @Column(name = "\"current_role\"")
    private String currentRole;

    private String targetRole;
    private Integer progress;
    private String mentor;
    private String employeeSkills;
    private String skillGaps;
    private String trainingPlan;
    private Integer promotionScore;
    private Boolean promotionEligible;
    private String lastAutoUpdate;

    @Enumerated(EnumType.STRING)
    private PlanStatus status;

    public enum PlanStatus {
        ACTIVE,
        COMPLETED,
        ON_HOLD
    }
}