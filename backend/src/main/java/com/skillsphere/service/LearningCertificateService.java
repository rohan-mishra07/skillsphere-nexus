package com.skillsphere.service;

import com.skillsphere.dto.LearningCertificateDTO;
import com.skillsphere.model.Enrollment;
import com.skillsphere.model.LearningCertificate;
import com.skillsphere.repository.EnrollmentRepository;
import com.skillsphere.repository.LearningCertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service("coreLearningCertificateService")
@RequiredArgsConstructor
public class LearningCertificateService {

    private final LearningCertificateRepository certificateRepository;
    private final EnrollmentRepository enrollmentRepository;

    public LearningCertificateDTO generateCertificate(UUID enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id: " + enrollmentId));

        if (!Boolean.TRUE.equals(enrollment.getCompleted())) {
            throw new IllegalStateException("Cannot generate certificate for an incomplete course enrollment. Course progress must reach 100% first.");
        }

        // Return existing certificate if already generated
        Optional<LearningCertificate> existing = certificateRepository.findByEnrollmentId(enrollmentId);
        if (existing.isPresent()) {
            return toDTO(existing.get());
        }

        String certNum = "CERT-SKSP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LearningCertificate cert = LearningCertificate.builder()
                .empId(enrollment.getEmpId())
                .courseId(enrollment.getCourse() != null ? enrollment.getCourse().getCourseId() : null)
                .enrollmentId(enrollmentId)
                .certificateNumber(certNum)
                .issuedAt(LocalDateTime.now())
                .status("ISSUED")
                .build();

        return toDTO(certificateRepository.save(cert));
    }

    public LearningCertificateDTO getCertificate(UUID certificateId) {
        LearningCertificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + certificateId));
        return toDTO(cert);
    }

    public List<LearningCertificateDTO> getCertificatesForEmployee(UUID empId) {
        return certificateRepository.findByEmpId(empId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private LearningCertificateDTO toDTO(LearningCertificate cert) {
        return LearningCertificateDTO.builder()
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
