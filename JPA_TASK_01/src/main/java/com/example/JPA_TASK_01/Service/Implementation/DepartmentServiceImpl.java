package com.example.JPA_TASK_01.Service.Implementation;
import com.example.JPA_TASK_01.DTO.Department.DepartmentResponse;
import com.example.JPA_TASK_01.DTO.Employee.EmployeeResponse;
import com.example.JPA_TASK_01.Entity.Department;
import com.example.JPA_TASK_01.Mapper.DepartmentMapper;
import com.example.JPA_TASK_01.Mapper.EmployeeMapper;
import com.example.JPA_TASK_01.Repo.DeptRepository;
import com.example.JPA_TASK_01.Repo.EmployeeRepository;
import com.example.JPA_TASK_01.Service.DepartmentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DeptRepository deptRepo;
    private final EmployeeRepository employeeRepo;


    public DepartmentServiceImpl(
            DeptRepository deptRepo,
            EmployeeRepository employeeRepo) {
        this.deptRepo = deptRepo;
        this.employeeRepo = employeeRepo;
    }

    @Override
    public DepartmentResponse createDepartment(Department department) {
        Department saved = deptRepo.save(department);
        return DepartmentMapper.toResponse(saved);
    }

    @Override
    public DepartmentResponse getDepartment(Integer deptId) {
        Department dept = deptRepo.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        return DepartmentMapper.toResponse(dept);
    }

    @Override
    public List<DepartmentResponse> getAllDepartments() {
        return deptRepo.findAll()
                .stream()
                .map(DepartmentMapper::toResponse)
                .toList();
    }

    @Override
    public List<EmployeeResponse> getEmployeesByDepartment(Integer deptId) {
        return employeeRepo.findByDepartment_DeptId(deptId)
                .stream()
                .map(EmployeeMapper::toResponse)
                .toList();
    }

    @Override
    public void deleteDepartment(Integer deptId) {

        long count =
                employeeRepo.countByDepartment_DeptId(deptId);

        if (count > 0) {
            throw new RuntimeException(
                    "Cannot delete department. Employees are assigned to it."
            );
        }

        deptRepo.deleteById(deptId);
    }


}
