package com.skillsphere.controller;

import com.skillsphere.dto.CourseDTO;
import com.skillsphere.dto.LearningPathDTO;
import com.skillsphere.service.LearningPathService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning/paths")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LearningPathController {

    private final LearningPathService learningPathService;

    @PostMapping
    public LearningPathDTO createPath(@RequestBody LearningPathDTO dto) {
        return learningPathService.createPath(dto);
    }

    @GetMapping
    public List<LearningPathDTO> getAllPaths() {
        return learningPathService.getAllPaths();
    }

    @GetMapping("/{id}")
    public LearningPathDTO getPath(@PathVariable UUID id) {
        return learningPathService.getPath(id);
    }

    @PostMapping("/{id}/courses/{courseId}")
    public LearningPathDTO addCourseToPath(@PathVariable UUID id, @PathVariable UUID courseId) {
        return learningPathService.addCourseToPath(id, courseId);
    }

    @GetMapping("/{id}/courses")
    public List<CourseDTO> getCoursesInPath(@PathVariable UUID id) {
        return learningPathService.getCoursesInPath(id);
    }
}
