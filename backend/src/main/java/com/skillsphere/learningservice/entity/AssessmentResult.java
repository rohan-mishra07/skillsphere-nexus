package com.skillsphere.learningservice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.*;

@Entity(name = "LearningAssessmentResult")
@Table(name = "learning_assessment_results")
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
