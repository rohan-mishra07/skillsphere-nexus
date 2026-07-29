package com.skillsphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reason;
    private String status;
    private String approvedBy;

    public LeaveRequest() {}

    public LeaveRequest(Long id, Long userId, String userName, String leaveType, LocalDate startDate, LocalDate endDate, String reason, String status, String approvedBy) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
        this.status = status;
        this.approvedBy = approvedBy;
    }

    public static LeaveRequestBuilder builder() { return new LeaveRequestBuilder(); }

    public static class LeaveRequestBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private String leaveType;
        private LocalDate startDate;
        private LocalDate endDate;
        private String reason;
        private String status;
        private String approvedBy;

        public LeaveRequestBuilder id(Long id) { this.id = id; return this; }
        public LeaveRequestBuilder userId(Long userId) { this.userId = userId; return this; }
        public LeaveRequestBuilder userName(String userName) { this.userName = userName; return this; }
        public LeaveRequestBuilder leaveType(String leaveType) { this.leaveType = leaveType; return this; }
        public LeaveRequestBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public LeaveRequestBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public LeaveRequestBuilder reason(String reason) { this.reason = reason; return this; }
        public LeaveRequestBuilder status(String status) { this.status = status; return this; }
        public LeaveRequestBuilder approvedBy(String approvedBy) { this.approvedBy = approvedBy; return this; }

        public LeaveRequest build() {
            return new LeaveRequest(id, userId, userName, leaveType, startDate, endDate, reason, status, approvedBy);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
}
