package com.skillsphere.skillservice.entity;

import com.skillsphere.model.Employee;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID certId;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private String name;

    private String issuingOrganization;
    private String credentialId;
    private LocalDate issued;
    private LocalDate expiry;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Builder.Default
    private boolean verified = true;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = java.time.LocalDateTime.now();
        }
    }

    public enum Status {
        VALID,
        EXPIRED,
        PENDING_RENEWAL
    }
}