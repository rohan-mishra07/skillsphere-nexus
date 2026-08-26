package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assessment_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResult {

    @Id
    @GeneratedValue
    private UUID resultId;

    private UUID empId;
    private UUID courseId;
    private UUID enrollmentId;

    private Float score;
    private String resultStatus; // PASSED / FAILED

    private LocalDateTime assessedAt;
}
