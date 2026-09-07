package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID assessId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_fk", insertable = false, updatable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_entity_id")
    private Skill skill;

    private Long userId;
    private UUID employeeEmpId;
    private String userName;
    private Long skillId;
    private String skillName;
    private float score;
    private Boolean passed;
    private Boolean verified;
    private String status;
    private String testName;
    private String evaluatedBy;
    private String testDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.assessId == null) {
            this.assessId = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
