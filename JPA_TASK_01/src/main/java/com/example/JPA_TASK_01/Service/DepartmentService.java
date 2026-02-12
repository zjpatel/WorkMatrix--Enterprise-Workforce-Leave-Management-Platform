package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.Department.DepartmentResponse;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.Entity.Department;
import com.example.JPA_TASK_01.Entity.Employee;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse createDepartment(Department department);

    DepartmentResponse getDepartment(Integer deptId);

    List<DepartmentResponse> getAllDepartments();

    List<EmployeeResponse> getEmployeesByDepartment(Integer deptId);

    void deleteDepartment(Integer deptId);

}

