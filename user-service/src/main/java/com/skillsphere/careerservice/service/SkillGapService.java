package com.skillsphere.careerservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    public Object getSkillGaps(UUID empId, String targetRole) {
        Map<String, Object> result = new HashMap<>();
        result.put("employeeId", empId);
        result.put("targetRole", targetRole != null ? targetRole : "Senior Full-Stack Architect");
        result.put("requiredSkills", List.of("Spring Security 3", "Keycloak OAuth2", "Angular Standalone Components", "PostgreSQL"));
        result.put("gapsIdentified", List.of("Keycloak JwtAuthenticationConverter setup", "Angular HTTP Interceptors"));
        result.put("competencyMatchPercentage", 82.5);
        result.put("status", "IN_PROGRESS");
        return result;
    }
}
