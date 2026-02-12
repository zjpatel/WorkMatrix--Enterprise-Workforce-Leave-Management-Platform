package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.Employee.AdminEmployeeUpdateRequest;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.Service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.JPA_TASK_01.DTO.Employee.AdminEmployeeResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin/employees")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmployeeController {

  private final EmployeeService employeeService;

  public AdminEmployeeController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  // 🔹 ADMIN UPDATE ANY EMPLOYEE
// 🔥 ADMIN UPDATE USER (WORKS FOR ALL STATUSES)
  @PutMapping("/user/{userId}")
  public ResponseEntity<AdminEmployeeResponse> updateUser(
          @PathVariable Integer userId,
          @RequestBody AdminEmployeeUpdateRequest request) {

    return ResponseEntity.ok(
            employeeService.adminUpdateUser(userId, request)
    );
  }

  // 🔹 ADMIN DELETE EMPLOYEE
  @DeleteMapping("/{empId}")
  public ResponseEntity<String> deleteEmployee(@PathVariable Integer empId) {

    employeeService.deleteEmployee(empId);
    return ResponseEntity.ok("Employee deleted successfully");
  }

  // 🔥 NEW — ADMIN LIST ALL USERS
  @GetMapping
  public ResponseEntity<List<AdminEmployeeResponse>> getAllForAdmin() {
    return ResponseEntity.ok(employeeService.getAllUsersForAdmin());
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<AdminEmployeeResponse> getUserForAdmin(
          @PathVariable Integer userId) {

    return ResponseEntity.ok(
            employeeService.getUserForAdmin(userId)
    );
  }

}
