package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.entity.RoleRequirement;
import com.skillsphere.careerservice.repository.RoleRequirementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career/roles")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class RoleRequirementController {

    private final RoleRequirementRepository repository;

    @GetMapping
    public List<RoleRequirement> getAllRoles() {
        return repository.findAll();
    }
}
