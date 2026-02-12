package com.example.JPA_TASK_01.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dept")
public class Department {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "dept_id")
  private Integer deptId;

  @Column(name = "dept_name", nullable = false, unique = true)
  private String deptName;

  // getters & setters
  public Integer getDeptId() {
    return deptId;
  }

  public void setDeptId(Integer deptId) {
    this.deptId = deptId;
  }

  public String getDeptName() {
    return deptName;
  }

  public void setDeptName(String deptName) {
    this.deptName = deptName;
  }
}
