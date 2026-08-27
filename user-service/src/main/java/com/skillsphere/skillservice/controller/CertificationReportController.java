package com.skillsphere.skillservice.controller;

import com.skillsphere.skillservice.dto.CertificationReportDTO;
import com.skillsphere.skillservice.service.CertificationReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certifications/report")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificationReportController {

    private final CertificationReportService reportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('HR', 'ADMIN')")
    public CertificationReportDTO report() {
        return reportService.generate();
    }
}
