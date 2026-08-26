package com.skillsphere.controller;

import com.skillsphere.dto.CourseContentDTO;
import com.skillsphere.service.CourseContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning/contents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseContentController {

    private final CourseContentService courseContentService;

    @PostMapping
    public CourseContentDTO addContent(@RequestBody CourseContentDTO dto) {
        return courseContentService.addContent(dto);
    }

    @GetMapping("/course/{courseId}")
    public List<CourseContentDTO> getContentsForCourse(@PathVariable UUID courseId) {
        return courseContentService.getContentsForCourse(courseId);
    }

    @GetMapping("/{id}")
    public CourseContentDTO getContent(@PathVariable UUID id) {
        return courseContentService.getContent(id);
    }

    @PutMapping("/{id}")
    public CourseContentDTO updateContent(@PathVariable UUID id, @RequestBody CourseContentDTO dto) {
        return courseContentService.updateContent(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteContent(@PathVariable UUID id) {
        courseContentService.deleteContent(id);
    }
}
