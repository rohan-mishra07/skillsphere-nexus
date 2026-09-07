package com.skillsphere.skillservice.dto;

import lombok.*;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationReportDTO implements Serializable {

    private static final long serialVersionUID = 1L;
    private long total;
    private long active;
    private long expired;
    private long pendingRenewal;
    private long expiringWithin30Days;
    private double renewalRate;
}
