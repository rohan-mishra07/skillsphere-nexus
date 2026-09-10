package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.dto.CareerPlanDTO;
import com.skillsphere.careerservice.service.CareerPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CareerPlanController {

    private final CareerPlanService service;

    @PostMapping("/plans")
    public ResponseEntity<CareerPlanDTO> create(@RequestBody CareerPlanDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    @GetMapping("/plans")
    public ResponseEntity<List<CareerPlanDTO>> getPlans() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<CareerPlanDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/plans/employee/{empId}")
    public ResponseEntity<List<CareerPlanDTO>> getByEmployee(@PathVariable UUID empId) {
        return ResponseEntity.ok(service.getByEmployee(empId));
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<CareerPlanDTO> update(@PathVariable UUID id, @RequestBody CareerPlanDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
