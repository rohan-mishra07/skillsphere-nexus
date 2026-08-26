package com.skillsphere.service;

import com.skillsphere.dto.CourseDTO;
import com.skillsphere.dto.LearningPathDTO;
import com.skillsphere.model.Course;
import com.skillsphere.model.LearningPath;
import com.skillsphere.repository.CourseRepository;
import com.skillsphere.repository.LearningPathRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LearningPathService {

    private final LearningPathRepository learningPathRepository;
    private final CourseRepository courseRepository;

    public LearningPathDTO createPath(LearningPathDTO dto) {
        LearningPath path = LearningPath.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .targetRole(dto.getTargetRole())
                .courses(new ArrayList<>())
                .build();

        if (dto.getCourseIds() != null && !dto.getCourseIds().isEmpty()) {
            List<Course> courses = courseRepository.findAllById(dto.getCourseIds());
            path.setCourses(courses);
        }

        return toDTO(learningPathRepository.save(path));
    }

    public List<LearningPathDTO> getAllPaths() {
        return learningPathRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public LearningPathDTO getPath(UUID pathId) {
        LearningPath path = learningPathRepository.findById(pathId)
                .orElseThrow(() -> new RuntimeException("Learning Path not found with id: " + pathId));
        return toDTO(path);
    }

    public LearningPathDTO addCourseToPath(UUID pathId, UUID courseId) {
        LearningPath path = learningPathRepository.findById(pathId)
                .orElseThrow(() -> new RuntimeException("Learning Path not found with id: " + pathId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        if (!path.getCourses().contains(course)) {
            path.getCourses().add(course);
        }

        return toDTO(learningPathRepository.save(path));
    }

    public List<CourseDTO> getCoursesInPath(UUID pathId) {
        LearningPath path = learningPathRepository.findById(pathId)
                .orElseThrow(() -> new RuntimeException("Learning Path not found with id: " + pathId));

        return path.getCourses()
                .stream()
                .map(this::courseToDTO)
                .toList();
    }

    private LearningPathDTO toDTO(LearningPath path) {
        List<CourseDTO> courseDTOs = path.getCourses() != null
                ? path.getCourses().stream().map(this::courseToDTO).toList()
                : new ArrayList<>();

        List<UUID> courseIds = path.getCourses() != null
                ? path.getCourses().stream().map(Course::getCourseId).toList()
                : new ArrayList<>();

        return LearningPathDTO.builder()
                .pathId(path.getPathId())
                .title(path.getTitle())
                .description(path.getDescription())
                .targetRole(path.getTargetRole())
                .courses(courseDTOs)
                .courseIds(courseIds)
                .build();
    }

    private CourseDTO courseToDTO(Course course) {
        return CourseDTO.builder()
                .courseId(course.getCourseId())
                .title(course.getTitle())
                .description(course.getDescription())
                .duration(course.getDuration())
                .type(course.getType() != null ? course.getType().name() : "ONLINE")
                .instructor(course.getInstructor())
                .rating(course.getRating())
                .active(course.getActive())
                .build();
    }
}
