package com.skillsphere.learningservice.controller;

import com.skillsphere.learningservice.dto.CertificateDTO;
import com.skillsphere.learningservice.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning/certificates")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/generate")
    public CertificateDTO generateCertificate(
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) UUID enrollmentId) {
        UUID id = null;
        if (body != null && body.containsKey("enrollmentId") && body.get("enrollmentId") != null) {
            id = UUID.fromString(body.get("enrollmentId").toString());
        } else if (enrollmentId != null) {
            id = enrollmentId;
        }
        if (id == null) {
            throw new IllegalArgumentException("enrollmentId must be provided in request body or request parameters");
        }
        return certificateService.generateCertificate(Objects.requireNonNull(id, "id must not be null"));
    }

    @GetMapping("/{id}")
    public CertificateDTO getCertificate(@PathVariable @NonNull UUID id) {
        return certificateService.getCertificate(Objects.requireNonNull(id, "id must not be null"));
    }

    @GetMapping("/employee/{empId}")
    public List<CertificateDTO> getCertificatesForEmployee(@PathVariable @NonNull UUID empId) {
        return certificateService.getCertificatesForEmployee(Objects.requireNonNull(empId, "empId must not be null"));
    }
}

