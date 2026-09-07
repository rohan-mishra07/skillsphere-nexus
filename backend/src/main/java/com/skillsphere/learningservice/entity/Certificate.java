package com.skillsphere.learningservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "LmsCertificate")
@Table(name = "learning_certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue
    private UUID certificateId;

    private UUID empId;
    private UUID courseId;
    private UUID enrollmentId;

    @Column(nullable = false, unique = true)
    private String certificateNumber;

    private LocalDateTime issuedAt;
    private String status; // ISSUED, VALID
}
