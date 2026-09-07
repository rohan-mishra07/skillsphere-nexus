package com.skillsphere.learningservice.controller;

import com.skillsphere.learningservice.dto.CourseContentDTO;
import com.skillsphere.learningservice.service.CourseContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning/contents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CourseContentController {

    private final CourseContentService courseContentService;

    @PostMapping
    public CourseContentDTO addContent(@RequestBody @NonNull CourseContentDTO dto) {
        return courseContentService.addContent(Objects.requireNonNull(dto, "dto must not be null"));
    }

    @GetMapping("/course/{courseId}")
    public List<CourseContentDTO> getContentsForCourse(@PathVariable @NonNull UUID courseId) {
        return courseContentService.getContentsForCourse(Objects.requireNonNull(courseId, "courseId must not be null"));
    }

    @GetMapping("/{id}")
    public CourseContentDTO getContent(@PathVariable @NonNull UUID id) {
        return courseContentService.getContent(Objects.requireNonNull(id, "id must not be null"));
    }

    @PutMapping("/{id}")
    public CourseContentDTO updateContent(@PathVariable @NonNull UUID id, @RequestBody @NonNull CourseContentDTO dto) {
        return courseContentService.updateContent(Objects.requireNonNull(id, "id must not be null"), Objects.requireNonNull(dto, "dto must not be null"));
    }

    @DeleteMapping("/{id}")
    public void deleteContent(@PathVariable @NonNull UUID id) {
        courseContentService.deleteContent(Objects.requireNonNull(id, "id must not be null"));
    }
}

