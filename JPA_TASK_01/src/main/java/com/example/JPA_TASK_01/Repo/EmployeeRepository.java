package com.example.JPA_TASK_01.Repo;

import com.example.JPA_TASK_01.Entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByUser_UserId(Integer userId);

    Page<Employee> findByUser_NameContainingIgnoreCaseOrUser_EmailContainingIgnoreCase(
            String name, String email, Pageable pageable);

    List<Employee> findByDepartment_DeptId(Integer deptId);

    Optional<Employee> findByUser_Email(String email);

    long countByDepartment_DeptId(Integer deptId);

}
