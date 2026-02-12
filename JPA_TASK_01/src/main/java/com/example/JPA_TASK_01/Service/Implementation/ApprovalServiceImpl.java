package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.DTO.Approval.ApprovalRequest;
import com.example.JPA_TASK_01.Entity.*;
import com.example.JPA_TASK_01.Repo.*;
import com.example.JPA_TASK_01.Service.ApprovalService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ApprovalServiceImpl implements ApprovalService {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final DeptRepository deptRepo;
    private final ImageRepository imageRepo;

    public ApprovalServiceImpl(UserRepository userRepo, EmployeeRepository employeeRepo, DeptRepository deptRepo, ImageRepository imageRepo) {
        this.userRepo = userRepo;
        this.employeeRepo = employeeRepo;
        this.deptRepo = deptRepo;
        this.imageRepo = imageRepo;
    }

    @Override
    public void approveUser(ApprovalRequest request) {

        Integer userId = request.getUserId();
        Integer deptId = request.getDeptId();

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"PENDING".equals(user.getStatus())) {
            throw new RuntimeException("User already processed");
        }

        Department dept = deptRepo.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // 1️⃣ Create employee
        Employee emp = new Employee();
        emp.setUser(user);
        emp.setDepartment(dept);

        Employee savedEmp = employeeRepo.save(emp);


        // 3️⃣ Activate user
        user.setStatus("APPROVED");
        user.setEnabled(true);

        userRepo.save(user);
    }


    @Override
    public void rejectUser(Integer userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus("REJECTED");
        user.setEnabled(false);

        userRepo.save(user);
    }

    @Override
    public void reopenUser(Integer userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"REJECTED".equals(user.getStatus())) {
            throw new IllegalStateException(
                    "Only rejected users can be reopened");
        }

        user.setStatus("PENDING");
        user.setEnabled(false);

        userRepo.save(user);
    }

}
