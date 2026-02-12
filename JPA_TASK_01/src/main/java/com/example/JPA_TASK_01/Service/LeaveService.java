package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.LeaveRequest.ApplyLeaveRequest;
import com.example.JPA_TASK_01.DTO.LeaveRequest.EditLeaveRequest;
import com.example.JPA_TASK_01.Entity.LeaveRequest;

import java.time.LocalDate;
import java.util.List;


import com.example.JPA_TASK_01.DTO.LeaveRequest.LeaveResponse;

public interface LeaveService {

    LeaveResponse applyLeave(ApplyLeaveRequest request);

    List<LeaveResponse> getMyLeaves();

    LeaveResponse decideLeave(Integer leaveId, String decision);

    List<LeaveResponse> getPendingLeaves();

    LeaveResponse editLeave(int leaveId, EditLeaveRequest editLeaveRequest);

    LeaveResponse revokeLeave(int leaveId);

    void deletePendingLeave(int leaveId);

    List<LeaveResponse> filterLeavesForAdmin(
            Integer empId,
            String status,
            String leaveType,
            Integer year,
            LocalDate fromDate,
            LocalDate toDate
    );

}

