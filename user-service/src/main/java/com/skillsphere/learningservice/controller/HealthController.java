package com.skillsphere.learningservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController("learningHealthController")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthController {

    @GetMapping({"/api/learning/health"})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "learningservice");
        health.put("port", 8082);
        health.put("timestamp", LocalDateTime.now().toString());

        Map<String, Object> details = new HashMap<>();
        details.put("database", "UP (H2 Database)");
        health.put("details", details);

        return ResponseEntity.ok(health);
    }
}
