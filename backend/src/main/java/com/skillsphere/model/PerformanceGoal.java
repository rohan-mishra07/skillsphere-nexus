package com.skillsphere.model;

import jakarta.persistence.*;

@Entity
@Table(name = "performance_goals")
public class PerformanceGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private String title;
    private String description;
    private String kpiMetric;
    private int progress;
    private String status;
    private String dueDate;
    
    @Column(columnDefinition = "TEXT")
    private String managerFeedback;

    public PerformanceGoal() {}

    public PerformanceGoal(Long id, Long userId, String userName, String title, String description, String kpiMetric, int progress, String status, String dueDate, String managerFeedback) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.title = title;
        this.description = description;
        this.kpiMetric = kpiMetric;
        this.progress = progress;
        this.status = status;
        this.dueDate = dueDate;
        this.managerFeedback = managerFeedback;
    }

    public static PerformanceGoalBuilder builder() { return new PerformanceGoalBuilder(); }

    public static class PerformanceGoalBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private String title;
        private String description;
        private String kpiMetric;
        private int progress;
        private String status;
        private String dueDate;
        private String managerFeedback;

        public PerformanceGoalBuilder id(Long id) { this.id = id; return this; }
        public PerformanceGoalBuilder userId(Long userId) { this.userId = userId; return this; }
        public PerformanceGoalBuilder userName(String userName) { this.userName = userName; return this; }
        public PerformanceGoalBuilder title(String title) { this.title = title; return this; }
        public PerformanceGoalBuilder description(String description) { this.description = description; return this; }
        public PerformanceGoalBuilder kpiMetric(String kpiMetric) { this.kpiMetric = kpiMetric; return this; }
        public PerformanceGoalBuilder progress(int progress) { this.progress = progress; return this; }
        public PerformanceGoalBuilder status(String status) { this.status = status; return this; }
        public PerformanceGoalBuilder dueDate(String dueDate) { this.dueDate = dueDate; return this; }
        public PerformanceGoalBuilder managerFeedback(String managerFeedback) { this.managerFeedback = managerFeedback; return this; }

        public PerformanceGoal build() {
            return new PerformanceGoal(id, userId, userName, title, description, kpiMetric, progress, status, dueDate, managerFeedback);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getKpiMetric() { return kpiMetric; }
    public void setKpiMetric(String kpiMetric) { this.kpiMetric = kpiMetric; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getManagerFeedback() { return managerFeedback; }
    public void setManagerFeedback(String managerFeedback) { this.managerFeedback = managerFeedback; }
}
