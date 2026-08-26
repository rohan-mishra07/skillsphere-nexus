package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.CourseDTO;
import com.skillsphere.learningservice.entity.Course;
import com.skillsphere.learningservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CourseService {

    private final CourseRepository courseRepository;

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CourseDTO getCourse(UUID courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return toDTO(course);
    }

    public CourseDTO createCourse(CourseDTO dto) {
        Course course = Course.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .duration(dto.getDuration() != null ? dto.getDuration() : 10)
                .type(dto.getType() != null ? Course.CourseType.valueOf(dto.getType().toUpperCase()) : Course.CourseType.ONLINE)
                .instructor(dto.getInstructor() != null ? dto.getInstructor() : "Expert Trainer")
                .rating(dto.getRating() != null ? dto.getRating() : 5.0)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        return toDTO(courseRepository.save(course));
    }

    public void deleteCourse(UUID courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found with id: " + courseId);
        }
        courseRepository.deleteById(courseId);
    }

    private CourseDTO toDTO(Course course) {
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
