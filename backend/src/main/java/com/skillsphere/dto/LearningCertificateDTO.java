package com.skillsphere.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningCertificateDTO {
    private UUID certificateId;
    private UUID empId;
    private UUID courseId;
    private UUID enrollmentId;
    private String certificateNumber;
    private LocalDateTime issuedAt;
    private String status;
}
