package com.skillsphere.skillservice.service;

import com.skillsphere.model.Employee;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.skillservice.dto.ComplianceDTO;
import com.skillsphere.skillservice.entity.Certification;
import com.skillsphere.skillservice.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplianceService {

    private final EmployeeRepository employeeRepository;
    private final CertificationRepository certificationRepository;
    private final CertificationService certificationService;

    public ComplianceDTO getCompliance(UUID empId) {
        Employee employee = employeeRepository.findById(empId)
                .orElseGet(() -> employeeRepository.findByEmpId(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found")));

        List<Certification> certifications = certificationRepository.findByEmployeeEmpId(empId);
        certifications.forEach(certificationService::refreshStatus);

        long total = certifications.size();
        long expired = certifications.stream()
                .filter(c -> c.getStatus() == Certification.Status.EXPIRED)
                .count();
        long valid = certifications.stream()
                .filter(c -> c.getStatus() == Certification.Status.VALID)
                .count();

        return ComplianceDTO.builder()
                .employeeName(employee.getName())
                .totalCertifications(total)
                .validCertifications(valid)
                .expiredCertifications(expired)
                .compliant(total > 0 && expired == 0)
                .build();
    }
}
