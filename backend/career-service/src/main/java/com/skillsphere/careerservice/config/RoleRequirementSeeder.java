package com.skillsphere.careerservice.config;

import com.skillsphere.careerservice.entity.RoleRequirement;
import com.skillsphere.careerservice.repository.RoleRequirementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class RoleRequirementSeeder implements CommandLineRunner {

    private final RoleRequirementRepository repository;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            log.info("Seeding initial RoleRequirements...");
            List<RoleRequirement> roles = List.of(
                RoleRequirement.builder()
                    .roleName("Tech Lead")
                    .requiredSkills("Java, Spring Boot, System Design, Leadership")
                    .build(),
                RoleRequirement.builder()
                    .roleName("Senior Developer")
                    .requiredSkills("Java, Microservices, CI/CD, Spring Boot")
                    .build(),
                RoleRequirement.builder()
                    .roleName("Engineering Manager")
                    .requiredSkills("Leadership, System Design, Budgeting, Mentoring")
                    .build(),
                RoleRequirement.builder()
                    .roleName("DevOps Engineer")
                    .requiredSkills("Docker, Kubernetes, CI/CD, AWS")
                    .build(),
                RoleRequirement.builder()
                    .roleName("Product Manager")
                    .requiredSkills("Roadmapping, Stakeholder Management, Agile, Analytics")
                    .build()
            );
            repository.saveAll(roles);
            log.info("Successfully seeded {} role requirements.", roles.size());
        }
    }
}
