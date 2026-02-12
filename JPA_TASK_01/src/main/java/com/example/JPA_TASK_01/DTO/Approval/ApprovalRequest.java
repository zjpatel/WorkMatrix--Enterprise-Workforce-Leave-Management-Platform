package com.example.JPA_TASK_01.DTO.Approval;

public class ApprovalRequest {

    private Integer userId;
    private Integer deptId;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getDeptId() {
        return deptId;
    }

    public void setDeptId(Integer deptId) {
        this.deptId = deptId;
    }
}
