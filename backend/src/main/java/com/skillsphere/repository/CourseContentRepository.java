package com.skillsphere.repository;

import com.skillsphere.model.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, UUID> {
    List<CourseContent> findByCourseCourseIdOrderBySequenceOrderAsc(UUID courseId);
}
