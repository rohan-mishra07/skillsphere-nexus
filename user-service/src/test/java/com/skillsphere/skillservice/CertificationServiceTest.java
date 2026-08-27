package com.skillsphere.skillservice;

import com.skillsphere.model.Employee;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.skillservice.dto.CertificationDTO;
import com.skillsphere.skillservice.entity.Certification;
import com.skillsphere.skillservice.repository.CertificationRepository;
import com.skillsphere.skillservice.service.CertificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificationServiceTest {

    @Mock
    private CertificationRepository certificationRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private CertificationService certificationService;

    private Employee testEmployee;
    private UUID empId;

    @BeforeEach
    void setUp() {
        empId = UUID.randomUUID();
        testEmployee = new Employee();
        testEmployee.setEmpId(empId);
        testEmployee.setName("Rohan Mishra");
    }

    @Test
    void testRegisterCertification() {
        CertificationDTO dto = CertificationDTO.builder()
                .empId(empId)
                .name("AWS Architect")
                .issuingOrganization("AWS")
                .credentialId("AWS-12345")
                .issued(LocalDate.now().minusMonths(6))
                .expiry(LocalDate.now().plusYears(2))
                .build();

        Certification cert = Certification.builder()
                .certId(UUID.randomUUID())
                .employee(testEmployee)
                .name(dto.getName())
                .issuingOrganization(dto.getIssuingOrganization())
                .credentialId(dto.getCredentialId())
                .issued(dto.getIssued())
                .expiry(dto.getExpiry())
                .status(Certification.Status.VALID)
                .build();

        when(employeeRepository.findById(empId)).thenReturn(Optional.of(testEmployee));
        when(certificationRepository.save(any(Certification.class))).thenReturn(cert);

        CertificationDTO result = certificationService.register(dto);

        assertNotNull(result);
        assertEquals("AWS Architect", result.getName());
        assertEquals("AWS", result.getIssuingOrganization());
        assertEquals("VALID", result.getStatus());
        verify(certificationRepository, times(1)).save(any(Certification.class));
    }
}
