package com.skillsphere.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserFeedbackController {

    private final List<Map<String, Object>> feedbacks = new ArrayList<>();

    public UserFeedbackController() {
        Map<String, Object> f1 = new ConcurrentHashMap<>();
        f1.put("id", "fb-seeded-1");
        f1.put("userName", "Sarah Jenkins");
        f1.put("userRole", "Platform Director");
        f1.put("rating", 5);
        f1.put("comment", "The adaptive skill assessments and automated career pathway recommendations are top tier.");
        f1.put("date", "Sept 7, 2026");
        feedbacks.add(f1);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFeedback() {
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("id")) {
            payload.put("id", "fb-" + System.currentTimeMillis());
        }
        feedbacks.add(0, payload);
        return ResponseEntity.ok(payload);
    }
}
