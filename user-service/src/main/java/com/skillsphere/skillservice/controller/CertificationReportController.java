package com.skillsphere.skillservice.controller;

import com.skillsphere.skillservice.dto.CertificationReportDTO;
import com.skillsphere.skillservice.service.CertificationReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certifications/report")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificationReportController {

    private final CertificationReportService reportService;

    @GetMapping
    public CertificationReportDTO report() {
        return reportService.generate();
    }
}
