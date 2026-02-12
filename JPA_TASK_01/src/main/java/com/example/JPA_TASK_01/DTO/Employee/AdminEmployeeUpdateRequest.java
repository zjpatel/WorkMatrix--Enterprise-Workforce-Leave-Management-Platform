package com.example.JPA_TASK_01.DTO.Employee;

public class AdminEmployeeUpdateRequest {

    private String name;
    private Integer age;
    private String gender;

    // 🔥 REQUIRED
    private String status;   //  APPROVED | PENDING | REJECTED
    private Integer deptId;  // required only when APPROVED

    // =====================
    // getters & setters
    // =====================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    // 🔥 NEW
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDeptId() {
        return deptId;
    }

    public void setDeptId(Integer deptId) {
        this.deptId = deptId;
    }
}
