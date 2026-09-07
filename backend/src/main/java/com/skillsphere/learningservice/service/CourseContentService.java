package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.CourseContentDTO;
import com.skillsphere.learningservice.entity.Course;
import com.skillsphere.learningservice.entity.CourseContent;
import com.skillsphere.learningservice.repository.CourseContentRepository;
import com.skillsphere.learningservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service("learningCourseContentService")
@RequiredArgsConstructor
public class CourseContentService {

    private final CourseContentRepository courseContentRepository;
    private final CourseRepository courseRepository;

    public CourseContentDTO addContent(CourseContentDTO dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + dto.getCourseId()));

        CourseContent content = CourseContent.builder()
                .course(course)
                .title(dto.getTitle())
                .contentType(dto.getContentType() != null ? dto.getContentType() : "LESSON")
                .urlOrData(dto.getUrlOrData())
                .sequenceOrder(dto.getSequenceOrder() != null ? dto.getSequenceOrder() : 1)
                .build();

        return toDTO(courseContentRepository.save(content));
    }

    public List<CourseContentDTO> getContentsForCourse(UUID courseId) {
        return courseContentRepository.findByCourseCourseIdOrderBySequenceOrderAsc(courseId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CourseContentDTO getContent(UUID contentId) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Course Content not found with id: " + contentId));
        return toDTO(content);
    }

    public CourseContentDTO updateContent(UUID contentId, CourseContentDTO dto) {
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Course Content not found with id: " + contentId));

        if (dto.getTitle() != null) content.setTitle(dto.getTitle());
        if (dto.getContentType() != null) content.setContentType(dto.getContentType());
        if (dto.getUrlOrData() != null) content.setUrlOrData(dto.getUrlOrData());
        if (dto.getSequenceOrder() != null) content.setSequenceOrder(dto.getSequenceOrder());

        return toDTO(courseContentRepository.save(content));
    }

    public void deleteContent(UUID contentId) {
        if (!courseContentRepository.existsById(contentId)) {
            throw new RuntimeException("Course Content not found with id: " + contentId);
        }
        courseContentRepository.deleteById(contentId);
    }

    private CourseContentDTO toDTO(CourseContent content) {
        return CourseContentDTO.builder()
                .contentId(content.getContentId())
                .courseId(content.getCourse() != null ? content.getCourse().getCourseId() : null)
                .title(content.getTitle())
                .contentType(content.getContentType())
                .urlOrData(content.getUrlOrData())
                .sequenceOrder(content.getSequenceOrder())
                .build();
    }
}
