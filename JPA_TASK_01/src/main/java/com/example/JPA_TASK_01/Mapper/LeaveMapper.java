package com.example.JPA_TASK_01.Mapper;

import com.example.JPA_TASK_01.DTO.LeaveRequest.LeaveResponse;
import com.example.JPA_TASK_01.Entity.LeaveRequest;

public class LeaveMapper {

    private LeaveMapper() {}

    public static LeaveResponse toResponse(LeaveRequest leave) {

        LeaveResponse response = new LeaveResponse();

        response.setLeaveId(leave.getLeaveId());
        response.setLeaveType(leave.getLeaveType());
        response.setStartDate(leave.getStartDate());
        response.setEndDate(leave.getEndDate());
        response.setTotalDays(leave.getTotalDays());
        response.setPaidDays(leave.getPaidDays());
        response.setUnpaidDays(leave.getUnpaidDays());
        response.setYear(leave.getYear());
        response.setStatus(leave.getStatus());
        response.setReason(leave.getReason());
        response.setAppliedAt(leave.getAppliedAt());
        response.setApprovedAt(leave.getApprovedAt());

        // employee info
        response.setEmpId(leave.getEmployee().getEmpId());
        response.setEmployeeName(
                leave.getEmployee().getUser().getName()
        );

        // admin info (nullable)
        if (leave.getApprovedBy() != null) {
            response.setApprovedBy(
                    leave.getApprovedBy().getName()
            );
        }

        return response;
    }
}
