package com.skillsphere.skillservice.dto;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private UUID certId;
    private UUID empId;
    private String employeeName;
    private String name;
    private String issuingOrganization;
    private String credentialId;
    private LocalDate issued;
    private LocalDate expiry;
    private String status;
}
