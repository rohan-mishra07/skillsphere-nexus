package com.skillsphere.careerservice.controller;

import com.skillsphere.careerservice.dto.CareerPlanDTO;
import com.skillsphere.careerservice.event.TrainingCompletedEvent;
import com.skillsphere.careerservice.listener.TrainingCompletedEventListener;
import com.skillsphere.careerservice.service.CareerPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/career/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class CareerPlanController {

    private final CareerPlanService service;
    private final TrainingCompletedEventListener kafkaListener;

    @PostMapping
    public CareerPlanDTO create(@RequestBody CareerPlanDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<CareerPlanDTO> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CareerPlanDTO getById(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/employee/{empId}")
    public List<CareerPlanDTO> getByEmployee(@PathVariable UUID empId) {
        return service.getByEmployee(empId);
    }

    @PutMapping("/{id}")
    public CareerPlanDTO update(@PathVariable UUID id, @RequestBody CareerPlanDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PostMapping("/trigger-completion")
    public String triggerCompletionEvent(@RequestBody TrainingCompletedEvent event) {
        if (event == null || event.getEmpId() == null || event.getCourseSkill() == null) {
            return "Invalid payload";
        }
        kafkaListener.processEvent(event.getEmpId(), event.getCourseSkill());
        return "Auto-progress triggered successfully for empId: " + event.getEmpId();
    }
}
