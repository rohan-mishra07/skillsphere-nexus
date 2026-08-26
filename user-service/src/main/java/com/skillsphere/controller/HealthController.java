package com.skillsphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthController {

    @GetMapping({"/api/health", "/health", "/api/v1/health"})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "user-service");
        health.put("port", 8080);
        health.put("timestamp", LocalDateTime.now().toString());

        Map<String, Object> details = new HashMap<>();
        details.put("database", "UP (H2 Database)");
        details.put("redis", "UP");
        health.put("details", details);

        return ResponseEntity.ok(health);
    }
}
