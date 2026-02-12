package com.example.JPA_TASK_01.DTO.Department;

public class DepartmentResponse {

    private Integer deptId;
    private String deptName;

    public DepartmentResponse(Integer deptId, String deptName) {
        this.deptId = deptId;
        this.deptName = deptName;
    }

    public Integer getDeptId() {
        return deptId;
    }

    public String getDeptName() {
        return deptName;
    }
}
