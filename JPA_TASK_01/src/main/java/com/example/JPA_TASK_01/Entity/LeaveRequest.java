package com.example.JPA_TASK_01.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_request")
public class LeaveRequest {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "leave_id")
  private Integer leaveId;

  @JoinColumn(name = "emp_id", nullable = false)
  @ManyToOne(fetch = FetchType.LAZY)
  private Employee employee;

  @Column(name = "leave_type", nullable = false)
  private String leaveType;

  @Column(name = "start_date", nullable = false)
  private LocalDate startDate;

  @Column(name = "end_date", nullable = false)
  private LocalDate endDate;

  @Column(name = "total_days", nullable = false)
  private Integer totalDays;

  @Column(name = "paid_days", nullable = false)
  private Integer paidDays;

  @Column(name = "unpaid_days", nullable = false)
  private Integer unpaidDays;

  @Column(name = "year", nullable = false)
  private Integer year;

  @Column(name = "status", nullable = false)
  private String status;

  @Column(name = "approved_at")
  private LocalDateTime approvedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "approved_by")
  private User approvedBy;

  @Column(name = "reason")
  private String reason;

  @Column(name = "applied_at", nullable = false)
  private LocalDateTime appliedAt;

  public LeaveRequest(
      Employee employee,
      String leaveType,
      LocalDate startDate,
      LocalDate endDate,
      Integer totalDays,
      Integer paidDays,
      Integer unpaidDays,
      Integer year,
      String status,
      LocalDateTime appliedAt,
      LocalDateTime approvedAt,
      User approvedBy,
      String reason) {
    this.employee = employee;
    this.leaveType = leaveType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.totalDays = totalDays;
    this.paidDays = paidDays;
    this.unpaidDays = unpaidDays;
    this.year = year;
    this.status = status;
    this.appliedAt = appliedAt;
    this.approvedAt = approvedAt;
    this.approvedBy = approvedBy;
    this.reason = reason;
  }

public LeaveRequest()
{

}

  public Integer getLeaveId() {
    return leaveId;
  }

  public void setLeaveId(Integer leaveId) {
    this.leaveId = leaveId;
  }

  public Employee getEmployee() {
    return employee;
  }

  public void setEmployee(Employee employee) {
    this.employee = employee;
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

  public User getApprovedBy() {
    return approvedBy;
  }

  public void setApprovedBy(User approvedBy) {
    this.approvedBy = approvedBy;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }
}
