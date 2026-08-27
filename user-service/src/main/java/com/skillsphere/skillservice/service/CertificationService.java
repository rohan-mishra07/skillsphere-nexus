package com.skillsphere.skillservice.service;

import com.skillsphere.model.Employee;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.skillservice.dto.CertificationDTO;
import com.skillsphere.skillservice.entity.Certification;
import com.skillsphere.skillservice.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final EmployeeRepository employeeRepository;

    public CertificationDTO register(CertificationDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmpId())
                .orElseGet(() -> employeeRepository.findByEmpId(dto.getEmpId())
                .orElseThrow(() -> new RuntimeException("Employee not found")));

        Certification certification = Certification.builder()
                .employee(employee)
                .name(dto.getName())
                .issuingOrganization(dto.getIssuingOrganization())
                .credentialId(dto.getCredentialId())
                .issued(dto.getIssued())
                .expiry(dto.getExpiry())
                .status(calculateStatus(dto.getExpiry()))
                .build();

        Certification saved = certificationRepository.save(certification);
        return toDTO(saved);
    }

    public CertificationDTO getById(UUID id) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));
        syncStatus(certification);
        return toDTO(certification);
    }

    public List<CertificationDTO> getByEmployee(UUID empId) {
        return certificationRepository.findByEmployeeEmpId(empId)
                .stream()
                .peek(this::syncStatus)
                .map(this::toDTO)
                .toList();
    }

    public CertificationDTO update(UUID id, CertificationDTO dto) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certification not found"));

        certification.setName(dto.getName());
        certification.setIssuingOrganization(dto.getIssuingOrganization());
        certification.setCredentialId(dto.getCredentialId());
        certification.setIssued(dto.getIssued());
        certification.setExpiry(dto.getExpiry());
        certification.setStatus(calculateStatus(dto.getExpiry()));

        return toDTO(certificationRepository.save(certification));
    }

    public void delete(UUID id) {
        if (!certificationRepository.existsById(id)) {
            throw new RuntimeException("Certification not found");
        }
        certificationRepository.deleteById(id);
    }

    public List<CertificationDTO> getExpiring() {
        LocalDate today = LocalDate.now();
        LocalDate end = today.plusDays(30);
        List<Certification> all = certificationRepository.findAll();
        return all.stream()
                .peek(this::syncStatus)
                .filter(c -> c.getStatus() == Certification.Status.PENDING_RENEWAL || 
                            (c.getExpiry() != null && !c.getExpiry().isBefore(today) && !c.getExpiry().isAfter(end)))
                .map(this::toDTO)
                .toList();
    }

    public List<CertificationDTO> getExpired() {
        List<Certification> all = certificationRepository.findAll();
        return all.stream()
                .peek(this::syncStatus)
                .filter(c -> c.getStatus() == Certification.Status.EXPIRED)
                .map(this::toDTO)
                .toList();
    }

    public void refreshStatus(Certification certification) {
        syncStatus(certification);
    }

    private void syncStatus(Certification cert) {
        Certification.Status expected = calculateStatus(cert.getExpiry());
        if (cert.getStatus() != expected) {
            cert.setStatus(expected);
            certificationRepository.save(cert);
        }
    }

    private Certification.Status calculateStatus(LocalDate expiry) {
        LocalDate today = LocalDate.now();
        if (expiry == null) {
            return Certification.Status.EXPIRED;
        }
        if (expiry.isBefore(today)) {
            return Certification.Status.EXPIRED;
        }
        if (!expiry.isAfter(today.plusDays(30))) {
            return Certification.Status.PENDING_RENEWAL;
        }
        return Certification.Status.VALID;
    }

    private CertificationDTO toDTO(Certification certification) {
        return CertificationDTO.builder()
                .certId(certification.getCertId())
                .empId(certification.getEmployee() != null ? certification.getEmployee().getEmpId() : null)
                .employeeName(certification.getEmployee() != null ? certification.getEmployee().getName() : null)
                .name(certification.getName())
                .issuingOrganization(certification.getIssuingOrganization())
                .credentialId(certification.getCredentialId())
                .issued(certification.getIssued())
                .expiry(certification.getExpiry())
                .status(certification.getStatus() != null ? certification.getStatus().name() : null)
                .build();
    }
}
