package com.example.JPA_TASK_01.DTO.Employee;
import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import java.util.List;

public class AdminEmployeeResponse {

    private Integer userId;
    private Integer empId;
    private String name;
    private String email;
    private Integer age;
    private String gender;
    private String status;      // users.status
    private Integer deptId;     // employee.dept_id (nullable)
    private String department; // department.dept_name (nullable)

    private List<ImageResponse> images;


    // ✅ REQUIRED for JPQL constructor projection
    public AdminEmployeeResponse(
            Integer userId,
            Integer empId,
            String name,
            String email,
            Integer age,
            String gender,
            String status,
            Integer deptId,
            String department,
            List<ImageResponse> images
    ) {
        this.userId = userId;
        this.empId = empId;
        this.name = name;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.status = status;
        this.deptId = deptId;
        this.department = department;
        this.images = images;
    }

    // ✅ Required by Jackson
    public AdminEmployeeResponse() {}

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getEmpId() {
        return empId;
    }

    public void setEmpId(Integer empId) {
        this.empId = empId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<ImageResponse> getImages() {
        return images;
    }

    public void setImages(List<ImageResponse> images) {
        this.images = images;
    }

}
