package com.skillsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long courseId;
    private String title;
    private String videoUrl;
    
    @Column(columnDefinition = "TEXT")
    private String notesContent;
    
    private String pdfUrl;
    private int durationMinutes;
    private int sequenceOrder;

    public Lesson() {}

    public Lesson(Long id, Long courseId, String title, String videoUrl, String notesContent, String pdfUrl, int durationMinutes, int sequenceOrder) {
        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.videoUrl = videoUrl;
        this.notesContent = notesContent;
        this.pdfUrl = pdfUrl;
        this.durationMinutes = durationMinutes;
        this.sequenceOrder = sequenceOrder;
    }

    public static LessonBuilder builder() { return new LessonBuilder(); }

    public static class LessonBuilder {
        private Long id;
        private Long courseId;
        private String title;
        private String videoUrl;
        private String notesContent;
        private String pdfUrl;
        private int durationMinutes;
        private int sequenceOrder;

        public LessonBuilder id(Long id) { this.id = id; return this; }
        public LessonBuilder courseId(Long courseId) { this.courseId = courseId; return this; }
        public LessonBuilder title(String title) { this.title = title; return this; }
        public LessonBuilder videoUrl(String videoUrl) { this.videoUrl = videoUrl; return this; }
        public LessonBuilder notesContent(String notesContent) { this.notesContent = notesContent; return this; }
        public LessonBuilder pdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; return this; }
        public LessonBuilder durationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; return this; }
        public LessonBuilder sequenceOrder(int sequenceOrder) { this.sequenceOrder = sequenceOrder; return this; }

        public Lesson build() {
            return new Lesson(id, courseId, title, videoUrl, notesContent, pdfUrl, durationMinutes, sequenceOrder);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public String getNotesContent() { return notesContent; }
    public void setNotesContent(String notesContent) { this.notesContent = notesContent; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public int getSequenceOrder() { return sequenceOrder; }
    public void setSequenceOrder(int sequenceOrder) { this.sequenceOrder = sequenceOrder; }
}
