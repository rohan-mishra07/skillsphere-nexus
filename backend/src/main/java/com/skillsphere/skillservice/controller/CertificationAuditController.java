package com.skillsphere.skillservice.controller;

import com.skillsphere.skillservice.entity.CertificationAudit;
import com.skillsphere.skillservice.service.CertificationAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificationAuditController {

    private final CertificationAuditService auditService;

    @GetMapping("/{certificationId}/audit")
    public List<CertificationAudit> getAudit(@PathVariable UUID certificationId) {
        return auditService.getAudit(certificationId);
    }
}
