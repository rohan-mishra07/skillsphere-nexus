package com.skillsphere.controller;

import com.skillsphere.model.PerformanceGoal;
import com.skillsphere.repository.PerformanceGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PerformanceController {

    @Autowired
    private PerformanceGoalRepository performanceGoalRepository;

    @GetMapping("/goals")
    public ResponseEntity<List<PerformanceGoal>> getAllGoals() {
        return ResponseEntity.ok(performanceGoalRepository.findAll());
    }

    @GetMapping("/goals/user/{userId}")
    public ResponseEntity<List<PerformanceGoal>> getUserGoals(@PathVariable Long userId) {
        return ResponseEntity.ok(performanceGoalRepository.findByUserId(userId));
    }

    @PostMapping("/goals")
    public ResponseEntity<PerformanceGoal> createGoal(@RequestBody PerformanceGoal goal) {
        if (goal.getStatus() == null) goal.setStatus("In Progress");
        return ResponseEntity.ok(performanceGoalRepository.save(goal));
    }

    @PutMapping("/goals/{id}/progress")
    public ResponseEntity<PerformanceGoal> updateProgress(@PathVariable Long id, @RequestParam int progress) {
        return performanceGoalRepository.findById(id).map(goal -> {
            goal.setProgress(progress);
            if (progress >= 100) goal.setStatus("Achieved");
            else if (progress > 0) goal.setStatus("In Progress");
            return ResponseEntity.ok(performanceGoalRepository.save(goal));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/goals/{id}/feedback")
    public ResponseEntity<PerformanceGoal> addFeedback(@PathVariable Long id, @RequestBody String feedback) {
        return performanceGoalRepository.findById(id).map(goal -> {
            goal.setManagerFeedback(feedback);
            return ResponseEntity.ok(performanceGoalRepository.save(goal));
        }).orElse(ResponseEntity.notFound().build());
    }
}
