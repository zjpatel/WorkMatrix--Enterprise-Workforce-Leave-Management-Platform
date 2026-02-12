package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.Approval.ApprovalRequest;

public interface ApprovalService {

    void approveUser(ApprovalRequest request);

    void rejectUser(Integer userId);

    void reopenUser(Integer userId);

}
