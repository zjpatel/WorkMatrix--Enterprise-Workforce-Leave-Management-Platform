package com.example.JPA_TASK_01.Specification;

import com.example.JPA_TASK_01.Entity.LeaveRequest;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class LeaveRequestSpecification {

    // 🔹 Filter by employee ID
    public static Specification<LeaveRequest> hasEmpId(Integer empId) {
        return (root, query, cb) ->
                empId == null ? null : cb.equal(root.get("employee").get("empId"), empId);
    }

    // 🔹 Filter by status
    public static Specification<LeaveRequest> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null : cb.equal(root.get("status"), status);
    }

    // 🔹 Filter by leave type
    public static Specification<LeaveRequest> hasLeaveType(String leaveType) {
        return (root, query, cb) ->
                leaveType == null ? null : cb.equal(root.get("leaveType"), leaveType);
    }

    // 🔹 Filter by year
    public static Specification<LeaveRequest> hasYear(Integer year) {
        return (root, query, cb) ->
                year == null ? null : cb.equal(root.get("year"), year);
    }

    // 🔹 Filter by start date (from)
    public static Specification<LeaveRequest> startDateFrom(LocalDate fromDate) {
        return (root, query, cb) ->
                fromDate == null ? null : cb.greaterThanOrEqualTo(root.get("startDate"), fromDate);
    }

    // 🔹 Filter by end date (to)
    public static Specification<LeaveRequest> endDateTo(LocalDate toDate) {
        return (root, query, cb) ->
                toDate == null ? null : cb.lessThanOrEqualTo(root.get("endDate"), toDate);
    }
}
