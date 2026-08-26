package com.skillsphere.skillservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "certification_audits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationAudit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID auditId;

    private UUID certificationId;
    private UUID employeeId;
    private String action;
    private String performedBy;
    private LocalDateTime performedAt;
}
