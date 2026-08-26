package com.skillsphere.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String userName;
    private LocalDate date;
    private String checkInTime;
    private String checkOutTime;
    private String status;
    private String shift;

    public Attendance() {}

    public Attendance(Long id, Long userId, String userName, LocalDate date, String checkInTime, String checkOutTime, String status, String shift) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.date = date;
        this.checkInTime = checkInTime;
        this.checkOutTime = checkOutTime;
        this.status = status;
        this.shift = shift;
    }

    public static AttendanceBuilder builder() { return new AttendanceBuilder(); }

    public static class AttendanceBuilder {
        private Long id;
        private Long userId;
        private String userName;
        private LocalDate date;
        private String checkInTime;
        private String checkOutTime;
        private String status;
        private String shift;

        public AttendanceBuilder id(Long id) { this.id = id; return this; }
        public AttendanceBuilder userId(Long userId) { this.userId = userId; return this; }
        public AttendanceBuilder userName(String userName) { this.userName = userName; return this; }
        public AttendanceBuilder date(LocalDate date) { this.date = date; return this; }
        public AttendanceBuilder checkInTime(String checkInTime) { this.checkInTime = checkInTime; return this; }
        public AttendanceBuilder checkOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; return this; }
        public AttendanceBuilder status(String status) { this.status = status; return this; }
        public AttendanceBuilder shift(String shift) { this.shift = shift; return this; }

        public Attendance build() {
            return new Attendance(id, userId, userName, date, checkInTime, checkOutTime, status, shift);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }
    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }
}
