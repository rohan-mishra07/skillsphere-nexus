package com.skillsphere.skillservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "certification_renewals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificationRenewal implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID renewalId;

    @ManyToOne
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    private LocalDate oldExpiry;
    private LocalDate newExpiry;

    @Enumerated(EnumType.STRING)
    private RenewalStatus status;

    private String requestedBy;
    private String approvedBy;
    private LocalDateTime requestedAt;
    private LocalDateTime approvedAt;

    public enum RenewalStatus {
        REQUESTED,
        APPROVED,
        REJECTED
    }
}
