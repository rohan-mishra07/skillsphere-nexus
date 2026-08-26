package com.skillsphere.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentResultDTO {
    private UUID resultId;
    private UUID empId;
    private UUID courseId;
    private UUID enrollmentId;
    private Float score;
    private String resultStatus;
    private LocalDateTime assessedAt;
}
