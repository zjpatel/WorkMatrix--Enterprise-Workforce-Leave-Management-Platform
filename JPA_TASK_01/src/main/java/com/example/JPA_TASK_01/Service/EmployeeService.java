package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.Employee.AdminEmployeeResponse;
import com.example.JPA_TASK_01.DTO.Employee.AdminEmployeeUpdateRequest;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeUpdateRequest;
import com.example.JPA_TASK_01.Entity.Employee;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {

  EmployeeResponse getMyProfile();

  Page<EmployeeResponse> getAllEmployees(int page, int size, String search);

  EmployeeResponse updateMyProfile(EmployeeUpdateRequest request);

  void deleteEmployee(Integer empId);

    EmployeeResponse getEmployeeByIdResponse(Integer empId);

    List<AdminEmployeeResponse> getAllUsersForAdmin();

    AdminEmployeeResponse getUserForAdmin(Integer userId);
    AdminEmployeeResponse adminUpdateUser(Integer userId, AdminEmployeeUpdateRequest request);




}
