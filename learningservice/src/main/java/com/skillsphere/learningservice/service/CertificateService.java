package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.CertificateDTO;
import com.skillsphere.learningservice.entity.Certificate;
import com.skillsphere.learningservice.entity.Enrollment;
import com.skillsphere.learningservice.repository.CertificateRepository;
import com.skillsphere.learningservice.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CertificateDTO generateCertificate(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        if (!Boolean.TRUE.equals(enrollment.getCompleted())) {
            throw new RuntimeException("Cannot generate certificate for incomplete course enrollment. Enrollment must be completed.");
        }

        // Return existing certificate if already generated
        Optional<Certificate> existing = certificateRepository.findByEnrollmentId(enrollmentId);
        if (existing.isPresent()) {
            return toDTO(existing.get());
        }

        String certNum = "SS-" + UUID.randomUUID().toString();

        Certificate cert = Certificate.builder()
                .empId(enrollment.getEmpId())
                .courseId(enrollment.getCourse() != null ? enrollment.getCourse().getCourseId() : null)
                .enrollmentId(enrollmentId)
                .certificateNumber(certNum)
                .issuedAt(LocalDateTime.now())
                .status("ISSUED")
                .build();

        return toDTO(certificateRepository.save(cert));
    }

    public CertificateDTO getCertificate(UUID certificateId) {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + certificateId));
        return toDTO(cert);
    }

    public List<CertificateDTO> getCertificatesForEmployee(UUID empId) {
        return certificateRepository.findByEmpId(empId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private CertificateDTO toDTO(Certificate cert) {
        return CertificateDTO.builder()
                .certificateId(cert.getCertificateId())
                .empId(cert.getEmpId())
                .courseId(cert.getCourseId())
                .enrollmentId(cert.getEnrollmentId())
                .certificateNumber(cert.getCertificateNumber())
                .issuedAt(cert.getIssuedAt())
                .status(cert.getStatus())
                .build();
    }
}
