package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.dto.IntegratedCareerDTO;
import com.skillsphere.careerservice.service.IntegrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/career/integration")
@RequiredArgsConstructor
public class IntegrationController {

    private final IntegrationService integrationService;

    @GetMapping("/employee/{empId}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'HR', 'ADMIN')")
    public ResponseEntity<IntegratedCareerDTO> getIntegratedCareer(
            @PathVariable UUID empId,
            @RequestParam(required = false, defaultValue = "Senior Developer") String targetRole) {
        IntegratedCareerDTO result = integrationService.getIntegratedCareer(empId, targetRole);
        return ResponseEntity.ok(result);
    }
}
