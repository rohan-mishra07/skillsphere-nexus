package com.skillsphere.skillservice.service;

import com.skillsphere.skillservice.dto.CertificationReportDTO;
import com.skillsphere.skillservice.entity.Certification;
import com.skillsphere.skillservice.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationReportService {

    private final CertificationRepository repository;

    public CertificationReportDTO generate() {
        List<Certification> all = repository.findAll();
        long total = all.size();
        long active = all.stream()
                .filter(c -> c.getStatus() == Certification.Status.VALID)
                .count();
        long expired = all.stream()
                .filter(c -> c.getStatus() == Certification.Status.EXPIRED)
                .count();
        long pending = all.stream()
                .filter(c -> c.getStatus() == Certification.Status.PENDING_RENEWAL)
                .count();

        LocalDate today = LocalDate.now();
        LocalDate end = today.plusDays(30);
        long expiring = all.stream()
                .filter(c -> c.getExpiry() != null &&
                        !c.getExpiry().isBefore(today) &&
                        !c.getExpiry().isAfter(end))
                .count();

        double renewalRate = total == 0 ? 0 : ((double) active / total) * 100.0;
        double roundedRate = Math.round(renewalRate * 100.0) / 100.0;

        return CertificationReportDTO.builder()
                .total(total)
                .active(active)
                .expired(expired)
                .pendingRenewal(pending)
                .expiringWithin30Days(expiring)
                .renewalRate(roundedRate)
                .build();
    }
}
