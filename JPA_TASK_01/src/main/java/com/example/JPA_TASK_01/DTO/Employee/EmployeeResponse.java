package com.example.JPA_TASK_01.DTO.Employee;

import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import java.util.List;

public class EmployeeResponse {

  private Integer empId;
  private String name;
  private String email;
  private String department;
  private Integer deptId;
  private List<ImageResponse> images;
  private Integer age;
  private String gender;

  // 🔥 ADD THIS
  private String status;

  public EmployeeResponse() {}

  public EmployeeResponse(
          Integer empId,
          String name,
          String email,
          String department,
          Integer deptId,
          List<ImageResponse> images,
          Integer age,
          String gender,
          String status) {

    this.empId = empId;
    this.name = name;
    this.email = email;
    this.department = department;
    this.deptId = deptId;
    this.images = images;
    this.age = age;
    this.gender = gender;
    this.status = status;
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

  public String getDepartment() {
    return department;
  }

  public void setDepartment(String department) {
    this.department = department;
  }

  public Integer getDeptId() {
    return deptId;
  }

  public void setDeptId(Integer deptId) {
    this.deptId = deptId;
  }

  public List<ImageResponse> getImages() {
    return images;
  }

  public void setImages(List<ImageResponse> images) {
    this.images = images;
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

  // 🔥 ADD THESE
  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }
}
