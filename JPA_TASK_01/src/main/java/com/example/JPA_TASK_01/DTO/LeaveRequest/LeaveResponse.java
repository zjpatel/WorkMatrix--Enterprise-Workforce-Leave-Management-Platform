package com.example.JPA_TASK_01.DTO.LeaveRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveResponse {

    private Integer leaveId;

    private Integer empId;
    private String employeeName;

    private String leaveType;

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer totalDays;
    private Integer paidDays;
    private Integer unpaidDays;

    private Integer year;

    private String status;

    private String reason;

    private LocalDateTime appliedAt;
    private LocalDateTime approvedAt;

    private String approvedBy; // admin name/email

    // ===============================
    // Constructors
    // ===============================
    public LeaveResponse() {}

    public LeaveResponse(
            Integer leaveId,
            Integer empId,
            String employeeName,
            String leaveType,
            LocalDate startDate,
            LocalDate endDate,
            Integer totalDays,
            Integer paidDays,
            Integer unpaidDays,
            Integer year,
            String status,
            String reason,
            LocalDateTime appliedAt,
            LocalDateTime approvedAt,
            String approvedBy
    ) {
        this.leaveId = leaveId;
        this.empId = empId;
        this.employeeName = employeeName;
        this.leaveType = leaveType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalDays = totalDays;
        this.paidDays = paidDays;
        this.unpaidDays = unpaidDays;
        this.year = year;
        this.status = status;
        this.reason = reason;
        this.appliedAt = appliedAt;
        this.approvedAt = approvedAt;
        this.approvedBy = approvedBy;
    }

    // ===============================
    // Getters & Setters
    // ===============================
    public Integer getLeaveId() {
        return leaveId;
    }

    public void setLeaveId(Integer leaveId) {
        this.leaveId = leaveId;
    }

    public Integer getEmpId() {
        return empId;
    }

    public void setEmpId(Integer empId) {
        this.empId = empId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getTotalDays() {
        return totalDays;
    }

    public void setTotalDays(Integer totalDays) {
        this.totalDays = totalDays;
    }

    public Integer getPaidDays() {
        return paidDays;
    }

    public void setPaidDays(Integer paidDays) {
        this.paidDays = paidDays;
    }

    public Integer getUnpaidDays() {
        return unpaidDays;
    }

    public void setUnpaidDays(Integer unpaidDays) {
        this.unpaidDays = unpaidDays;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }
}
