package com.skillsphere.controller;

import com.skillsphere.model.Attendance;
import com.skillsphere.model.LeaveRequest;
import com.skillsphere.repository.AttendanceRepository;
import com.skillsphere.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workforce")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkforceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping("/attendance/user/{userId}")
    public ResponseEntity<List<Attendance>> getUserAttendance(@PathVariable Long userId) {
        return ResponseEntity.ok(attendanceRepository.findByUserId(userId));
    }

    @GetMapping("/attendance/all")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    @PostMapping("/attendance/clock-in")
    @SuppressWarnings("null")
    public ResponseEntity<Attendance> clockIn(@RequestParam Long userId, @RequestParam String userName) {
        LocalDate today = LocalDate.now();
        String timeNow = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(userId, today);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        Attendance attendance = Attendance.builder()
                .userId(userId)
                .userName(userName)
                .date(today)
                .checkInTime(timeNow)
                .status("Present")
                .shift("Morning Shift (09:00 - 17:00)")
                .build();

        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    @PostMapping("/attendance/clock-out")
    @SuppressWarnings("null")
    public ResponseEntity<Attendance> clockOut(@RequestParam Long userId) {
        LocalDate today = LocalDate.now();
        String timeNow = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm"));

        Optional<Attendance> existing = attendanceRepository.findByUserIdAndDate(userId, today);
        if (existing.isPresent()) {
            Attendance attendance = existing.get();
            attendance.setCheckOutTime(timeNow);
            return ResponseEntity.ok(attendanceRepository.save(attendance));
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        return ResponseEntity.ok(leaveRequestRepository.findAll());
    }

    @GetMapping("/leaves/user/{userId}")
    public ResponseEntity<List<LeaveRequest>> getUserLeaves(@PathVariable Long userId) {
        return ResponseEntity.ok(leaveRequestRepository.findByUserId(userId));
    }

    @PostMapping("/leaves/apply")
    @SuppressWarnings("null")
    public ResponseEntity<LeaveRequest> applyLeave(@RequestBody LeaveRequest leaveRequest) {
        leaveRequest.setStatus("PENDING");
        return ResponseEntity.ok(leaveRequestRepository.save(leaveRequest));
    }

    @PutMapping("/leaves/{id}/status")
    @SuppressWarnings("null")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(@PathVariable Long id, @RequestParam String status, @RequestParam String approvedBy) {
        return leaveRequestRepository.findById(id).map(leave -> {
            leave.setStatus(status);
            leave.setApprovedBy(approvedBy);
            return ResponseEntity.ok(leaveRequestRepository.save(leave));
        }).orElse(ResponseEntity.notFound().build());
    }
}
