package com.skillsphere.learningservice.repository;

import com.skillsphere.learningservice.entity.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository("learningCourseContentRepository")
public interface CourseContentRepository extends JpaRepository<CourseContent, UUID> {
    List<CourseContent> findByCourseCourseIdOrderBySequenceOrderAsc(UUID courseId);
}
