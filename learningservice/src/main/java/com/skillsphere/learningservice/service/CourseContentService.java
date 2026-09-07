package com.skillsphere.learningservice.service;

import com.skillsphere.learningservice.dto.CourseContentDTO;
import com.skillsphere.learningservice.entity.Course;
import com.skillsphere.learningservice.entity.CourseContent;
import com.skillsphere.learningservice.repository.CourseContentRepository;
import com.skillsphere.learningservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseContentService {

    private final CourseContentRepository courseContentRepository;
    private final CourseRepository courseRepository;

    public CourseContentDTO addContent(@NonNull CourseContentDTO dto) {
        Objects.requireNonNull(dto, "dto must not be null");
        UUID courseId = Objects.requireNonNull(dto.getCourseId(), "courseId must not be null");
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        CourseContent content = CourseContent.builder()
                .course(course)
                .title(dto.getTitle())
                .contentType(dto.getContentType() != null ? dto.getContentType() : "LESSON")
                .urlOrData(dto.getUrlOrData())
                .sequenceOrder(dto.getSequenceOrder() != null ? dto.getSequenceOrder() : 1)
                .build();

        return toDTO(courseContentRepository.save(Objects.requireNonNull(content, "content must not be null")));
    }

    public List<CourseContentDTO> getContentsForCourse(@NonNull UUID courseId) {
        Objects.requireNonNull(courseId, "courseId must not be null");
        return courseContentRepository.findByCourseCourseIdOrderBySequenceOrderAsc(courseId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CourseContentDTO getContent(@NonNull UUID contentId) {
        Objects.requireNonNull(contentId, "contentId must not be null");
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Course Content not found with id: " + contentId));
        return toDTO(content);
    }

    public CourseContentDTO updateContent(@NonNull UUID contentId, @NonNull CourseContentDTO dto) {
        Objects.requireNonNull(contentId, "contentId must not be null");
        Objects.requireNonNull(dto, "dto must not be null");
        CourseContent content = courseContentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Course Content not found with id: " + contentId));

        if (dto.getTitle() != null) content.setTitle(dto.getTitle());
        if (dto.getContentType() != null) content.setContentType(dto.getContentType());
        if (dto.getUrlOrData() != null) content.setUrlOrData(dto.getUrlOrData());
        if (dto.getSequenceOrder() != null) content.setSequenceOrder(dto.getSequenceOrder());

        return toDTO(courseContentRepository.save(Objects.requireNonNull(content, "content must not be null")));
    }

    public void deleteContent(@NonNull UUID contentId) {
        Objects.requireNonNull(contentId, "contentId must not be null");
        if (!courseContentRepository.existsById(contentId)) {
            throw new RuntimeException("Course Content not found with id: " + contentId);
        }
        courseContentRepository.deleteById(contentId);
    }

    private CourseContentDTO toDTO(CourseContent content) {
        if (content == null) return null;
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

