package com.skillsphere.skillservice.controller;

import com.skillsphere.skillservice.dto.ComplianceDTO;
import com.skillsphere.skillservice.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/certifications/compliance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ComplianceController {

    private final ComplianceService complianceService;

    @GetMapping("/{empId}")
    public ComplianceDTO getCompliance(@PathVariable UUID empId) {
        return complianceService.getCompliance(empId);
    }
}
