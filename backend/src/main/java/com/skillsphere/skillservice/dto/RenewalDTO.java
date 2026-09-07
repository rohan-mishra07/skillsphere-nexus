package com.skillsphere.skillservice.dto;

import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RenewalDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private UUID renewalId;
    private UUID certificationId;
    private LocalDate oldExpiry;
    private LocalDate newExpiry;
    private String status;
    private String requestedBy;
    private String approvedBy;
}
