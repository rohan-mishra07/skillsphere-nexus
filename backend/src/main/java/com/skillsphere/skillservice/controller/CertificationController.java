package com.skillsphere.skillservice.controller;

import com.skillsphere.skillservice.dto.CertificationDTO;
import com.skillsphere.skillservice.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CertificationController {

    private final CertificationService certificationService;

    @PostMapping
    public CertificationDTO register(@RequestBody CertificationDTO dto) {
        return certificationService.register(dto);
    }

    @GetMapping("/{id}")
    public CertificationDTO getById(@PathVariable UUID id) {
        return certificationService.getById(id);
    }

    @GetMapping("/employee/{empId}")
    public List<CertificationDTO> getByEmployee(@PathVariable UUID empId) {
        return certificationService.getByEmployee(empId);
    }

    @PutMapping("/{id}")
    public CertificationDTO update(@PathVariable UUID id, @RequestBody CertificationDTO dto) {
        return certificationService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        certificationService.delete(id);
    }

    @GetMapping("/expiring")
    public List<CertificationDTO> expiring() {
        return certificationService.getExpiring();
    }

    @GetMapping("/expired")
    public List<CertificationDTO> expired() {
        return certificationService.getExpired();
    }
}
