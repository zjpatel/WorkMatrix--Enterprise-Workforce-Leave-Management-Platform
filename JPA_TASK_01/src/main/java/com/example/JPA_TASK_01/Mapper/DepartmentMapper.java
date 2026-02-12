package com.example.JPA_TASK_01.Mapper;

import com.example.JPA_TASK_01.DTO.Department.DepartmentResponse;
import com.example.JPA_TASK_01.Entity.Department;

public class DepartmentMapper {

    private DepartmentMapper() {}

    public static DepartmentResponse toResponse(Department dept) {

        if (dept == null) return null;

        return new DepartmentResponse(
                dept.getDeptId(),
                dept.getDeptName()
        );
    }
}
