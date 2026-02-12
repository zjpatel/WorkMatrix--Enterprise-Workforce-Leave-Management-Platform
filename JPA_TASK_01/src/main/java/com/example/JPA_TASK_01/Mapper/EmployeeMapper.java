package com.example.JPA_TASK_01.Mapper;

import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import com.example.JPA_TASK_01.Entity.Employee;

import java.util.List;

public class EmployeeMapper {

    private EmployeeMapper() {}

    public static EmployeeResponse toResponse(Employee emp) {

        List<ImageResponse> images =
                emp.getImages()
                        .stream()
                        .map(img -> new ImageResponse(
                                img.getImageId(),
                                img.getFileName()))
                        .toList();

        return new EmployeeResponse(
                emp.getEmpId(),
                emp.getUser().getName(),
                emp.getUser().getEmail(),
                emp.getDepartment().getDeptName(),
                emp.getDepartment().getDeptId(),   // ✅ FIX
                images,
                emp.getUser().getAge(),
                emp.getUser().getGender(),
                emp.getUser().getStatus()          // ✅ STATUS FROM USERS TABLE
        );
    }
}
