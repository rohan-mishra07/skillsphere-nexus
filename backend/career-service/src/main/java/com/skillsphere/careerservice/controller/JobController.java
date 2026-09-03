package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.dto.JobDTO;
import com.skillsphere.careerservice.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/career/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class JobController {

    private final JobService service;

    @PostMapping
    public JobDTO create(@RequestBody JobDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<JobDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/active")
    public List<JobDTO> getActive() {
        return service.getActiveJobs();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
