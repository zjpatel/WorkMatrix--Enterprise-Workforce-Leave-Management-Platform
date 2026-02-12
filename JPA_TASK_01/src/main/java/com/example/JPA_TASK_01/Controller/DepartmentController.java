package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.Department.DepartmentResponse;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.Entity.Department;
import com.example.JPA_TASK_01.Service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

  private final DepartmentService departmentService;

  public DepartmentController(DepartmentService departmentService) {
    this.departmentService = departmentService;
  }

  // ===============================
  // CREATE DEPARTMENT (ADMIN)
  // ===============================
  @PostMapping
  public ResponseEntity<DepartmentResponse> createDepartment(
          @RequestBody Department department) {

    DepartmentResponse created =
            departmentService.createDepartment(department);

    return new ResponseEntity<>(created, HttpStatus.CREATED);
  }

  // ===============================
  // GET ALL DEPARTMENTS
  // (USED FOR DROPDOWNS)
  // ===============================
  @GetMapping
  public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {

    List<DepartmentResponse> departments =
            departmentService.getAllDepartments();

    return ResponseEntity.ok(departments);
  }

  // ===============================
  // GET DEPARTMENT BY ID
  // ===============================
  @GetMapping("/{deptId}")
  public ResponseEntity<DepartmentResponse> getDepartmentById(
          @PathVariable Integer deptId) {

    DepartmentResponse department =
            departmentService.getDepartment(deptId);

    return ResponseEntity.ok(department);
  }

  // ===============================
  // GET EMPLOYEES OF A DEPARTMENT
  // ===============================
  @GetMapping("/{deptId}/employees")
  public ResponseEntity<List<EmployeeResponse>> getEmployeesByDepartment(
          @PathVariable Integer deptId) {

    List<EmployeeResponse> employees =
            departmentService.getEmployeesByDepartment(deptId);

    return ResponseEntity.ok(employees);
  }
  @DeleteMapping("/{deptId}")
  public ResponseEntity<String> deleteDepartment(
          @PathVariable Integer deptId) {

    departmentService.deleteDepartment(deptId);
    return ResponseEntity.ok("Department deleted successfully");
  }

}
