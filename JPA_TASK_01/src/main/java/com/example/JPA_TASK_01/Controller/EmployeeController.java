package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeUpdateRequest;
import com.example.JPA_TASK_01.Entity.Employee;
import com.example.JPA_TASK_01.Service.EmployeeService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

  private final EmployeeService employeeService;

  public EmployeeController(EmployeeService employeeService) {
    this.employeeService = employeeService;
  }

  // 🔹 GET OWN PROFILE
  @GetMapping("/me")
  public ResponseEntity<EmployeeResponse> getMyProfile() {
    return ResponseEntity.ok(employeeService.getMyProfile());
  }

  // 🔹 UPDATE OWN PROFILE (NO DEPT)
  @PutMapping("/me")
  public ResponseEntity<EmployeeResponse> updateMyProfile(
          @RequestBody EmployeeUpdateRequest request) {

    return ResponseEntity.ok(employeeService.updateMyProfile(request));
  }

  // 🔹 VIEW ALL EMPLOYEES
  @GetMapping
  public ResponseEntity<Page<EmployeeResponse>> getAllEmployees(
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "5") int size,
          @RequestParam(required = false) String search) {

    return ResponseEntity.ok(
            employeeService.getAllEmployees(page, size, search));
  }

  @GetMapping("/{empId}")
  public ResponseEntity<EmployeeResponse> getEmployeeById(
          @PathVariable Integer empId) {

    return ResponseEntity.ok(
            employeeService.getEmployeeByIdResponse(empId)
    );
  }




}
