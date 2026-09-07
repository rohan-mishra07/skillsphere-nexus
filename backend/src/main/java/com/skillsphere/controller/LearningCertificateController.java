package com.skillsphere.controller;

import com.skillsphere.dto.LearningCertificateDTO;
import com.skillsphere.service.LearningCertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController("coreLearningCertificateController")
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LearningCertificateController {

    private final LearningCertificateService certificateService;

    @PostMapping("/generate")
    public LearningCertificateDTO generateCertificate(@RequestParam UUID enrollmentId) {
        return certificateService.generateCertificate(enrollmentId);
    }

    @GetMapping("/{id}")
    public LearningCertificateDTO getCertificate(@PathVariable UUID id) {
        return certificateService.getCertificate(id);
    }

    @GetMapping("/employee/{empId}")
    public List<LearningCertificateDTO> getCertificatesForEmployee(@PathVariable UUID empId) {
        return certificateService.getCertificatesForEmployee(empId);
    }
}
