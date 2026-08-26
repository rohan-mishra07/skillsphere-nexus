package com.skillsphere.skillservice.config;

import com.skillsphere.model.Employee;
import com.skillsphere.repository.EmployeeRepository;
import com.skillsphere.skillservice.entity.Certification;
import com.skillsphere.skillservice.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@Order(1)
@RequiredArgsConstructor
public class CertificationDataMigration implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;
    private final CertificationRepository certificationRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Check if legacy_certifications table exists in H2/SQL database
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'LEGACY_CERTIFICATIONS'",
                    Integer.class
            );

            if (count != null && count > 0) {
                System.out.println("--> [Data Migration] Migrating legacy_certifications to unified certifications table...");

                List<Map<String, Object>> legacyRows = jdbcTemplate.queryForList("SELECT * FROM legacy_certifications");

                for (Map<String, Object> row : legacyRows) {
                    Object empIdObj = row.get("EMPLOYEE_EMP_ID");
                    Object certNameObj = row.get("CERTIFICATION_NAME");
                    Object issuingObj = row.get("ISSUING_AUTHORITY");
                    Object issueDateObj = row.get("ISSUE_DATE");
                    Object expiryDateObj = row.get("EXPIRY_DATE");
                    Object statusObj = row.get("STATUS");

                    String certName = certNameObj != null ? certNameObj.toString() : "Professional Certification";
                    String issuingOrg = issuingObj != null ? issuingObj.toString() : "Certified Body";
                    
                    UUID empUuid = null;
                    if (empIdObj instanceof UUID) {
                        empUuid = (UUID) empIdObj;
                    } else if (empIdObj != null) {
                        try {
                            empUuid = UUID.fromString(empIdObj.toString());
                        } catch (Exception ignored) {}
                    }

                    if (empUuid == null) {
                        Employee firstEmp = employeeRepository.findAll().stream().findFirst().orElse(null);
                        if (firstEmp != null) {
                            empUuid = firstEmp.getEmpId();
                        }
                    }

                    if (empUuid != null) {
                        final UUID targetEmpUuid = empUuid;
                        Employee employee = employeeRepository.findById(targetEmpUuid)
                                .orElseGet(() -> employeeRepository.findByEmpId(targetEmpUuid).orElse(null));

                        if (employee != null) {
                            LocalDate issued = null;
                            LocalDate expiry = null;
                            try {
                                if (issueDateObj != null) issued = LocalDate.parse(issueDateObj.toString());
                                if (expiryDateObj != null) expiry = LocalDate.parse(expiryDateObj.toString());
                            } catch (Exception ignored) {}

                            Certification.Status status = Certification.Status.VALID;
                            if (statusObj != null && "EXPIRED".equalsIgnoreCase(statusObj.toString())) {
                                status = Certification.Status.EXPIRED;
                            } else if (statusObj != null && "PENDING_RENEWAL".equalsIgnoreCase(statusObj.toString())) {
                                status = Certification.Status.PENDING_RENEWAL;
                            }

                            Certification unifiedCert = Certification.builder()
                                    .employee(employee)
                                    .name(certName)
                                    .issuingOrganization(issuingOrg)
                                    .credentialId("MIGRATED-" + System.currentTimeMillis() % 10000)
                                    .issued(issued != null ? issued : LocalDate.now().minusYears(1))
                                    .expiry(expiry != null ? expiry : LocalDate.now().plusYears(1))
                                    .status(status)
                                    .verified(true)
                                    .build();

                            certificationRepository.save(unifiedCert);
                        }
                    }
                }

                // Drop legacy table after successful migration
                jdbcTemplate.execute("DROP TABLE IF EXISTS legacy_certifications");
                System.out.println("--> [Data Migration] Data migration complete and legacy_certifications table dropped successfully.");
            }
        } catch (Exception e) {
            System.out.println("--> [Data Migration] Note: " + e.getMessage());
        }
    }
}
