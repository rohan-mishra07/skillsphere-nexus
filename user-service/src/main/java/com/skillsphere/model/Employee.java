package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private UUID empId;

    private Long id;

    @Column(nullable = false)
    private String name;

    private String email;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String department;
    private String designation;

    public enum Role {
        DEVELOPER, MANAGER, TECH_LEAD, HR, ADMIN, TRAINING_MANAGER
    }
}
