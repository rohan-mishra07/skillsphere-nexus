package com.skillsphere.skillservice.dto;

import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private String employeeName;
    private long totalCertifications;
    private long validCertifications;
    private long expiredCertifications;
    private boolean compliant;
}
