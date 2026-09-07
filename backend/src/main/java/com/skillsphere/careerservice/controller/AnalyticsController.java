package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.dto.AnalyticsDTO;
import com.skillsphere.careerservice.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/career/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class AnalyticsController {

    private final AnalyticsService service;

    @GetMapping
    public AnalyticsDTO getAnalytics() {
        return service.getAnalytics();
    }
}
