package com.skillsphere.careerservice.service;

import com.skillsphere.skillservice.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificationIntegrationService {

    private final CertificationRepository certificationRepository;

    public Object getEmployeeCertifications(UUID empId) {
        return certificationRepository.findByEmployeeEmpId(empId);
    }
}
