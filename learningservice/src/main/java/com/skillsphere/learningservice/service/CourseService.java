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

    /**
     * Updates mutable fields of an existing course.
     * Only non-null DTO fields are applied (patch semantics).
     * Restricted callers: ADMIN, TRAINER — enforced at the controller layer.
     */
    public CourseDTO updateCourse(UUID courseId, CourseDTO dto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        if (dto.getTitle()       != null) course.setTitle(dto.getTitle());
        if (dto.getDescription() != null) course.setDescription(dto.getDescription());
        if (dto.getDuration()    != null) course.setDuration(dto.getDuration());
        if (dto.getType()        != null) course.setType(Course.CourseType.valueOf(dto.getType().toUpperCase()));
        if (dto.getInstructor()  != null) course.setInstructor(dto.getInstructor());
        if (dto.getRating()      != null) course.setRating(dto.getRating());
        if (dto.getActive()      != null) course.setActive(dto.getActive());

        return toDTO(courseRepository.save(course));
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
