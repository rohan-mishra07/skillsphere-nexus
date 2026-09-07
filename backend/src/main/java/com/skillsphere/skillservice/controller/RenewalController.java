package com.skillsphere.skillservice.controller;

import com.skillsphere.skillservice.dto.RenewalDTO;
import com.skillsphere.skillservice.service.RenewalService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

import java.util.Map;

@RestController
@RequestMapping("/api/certifications/renewals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RenewalController {

    private final RenewalService renewalService;

    @PostMapping("/{certificationId}")
    public RenewalDTO request(
            @PathVariable UUID certificationId,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String requestedBy) {
        String by = requestedBy;
        if ((by == null || by.isBlank()) && body != null && body.containsKey("requestedBy") && body.get("requestedBy") != null) {
            by = body.get("requestedBy").toString();
        }
        if (by == null || by.isBlank()) {
            by = "Employee";
        }
        return renewalService.requestRenewal(certificationId, by);
    }

    @PutMapping("/{renewalId}/approve")
    public RenewalDTO approve(
            @PathVariable UUID renewalId,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newExpiry,
            @RequestParam(required = false) String approvedBy) {
        LocalDate expiry = newExpiry;
        String by = approvedBy;

        if (body != null) {
            if (expiry == null && body.containsKey("newExpiry") && body.get("newExpiry") != null) {
                expiry = LocalDate.parse(body.get("newExpiry").toString());
            }
            if ((by == null || by.isBlank()) && body.containsKey("approvedBy") && body.get("approvedBy") != null) {
                by = body.get("approvedBy").toString();
            }
        }

        if (expiry == null) {
            expiry = LocalDate.now().plusYears(2);
        }
        if (by == null || by.isBlank()) {
            by = "Manager";
        }

        return renewalService.approveRenewal(renewalId, expiry, by);
    }
}
