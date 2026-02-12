package com.example.JPA_TASK_01.Service.Implementation;
import com.example.JPA_TASK_01.DTO.Employee.*;
import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import com.example.JPA_TASK_01.Entity.Department;
import com.example.JPA_TASK_01.Entity.Employee;
import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Repo.DeptRepository;
import com.example.JPA_TASK_01.Repo.EmployeeRepository;
import com.example.JPA_TASK_01.Repo.ImageRepository;
import com.example.JPA_TASK_01.Repo.UserRepository;
import com.example.JPA_TASK_01.Service.EmployeeService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepo;
    private final DeptRepository deptRepo;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepo,
            DeptRepository deptRepo,
            ImageRepository imageRepository,
            UserRepository userRepository) {

        this.employeeRepo = employeeRepo;
        this.deptRepo = deptRepo;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
    }

    private String getLoggedInEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private boolean isAdmin() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    // ===============================
    // GET MY PROFILE
    // ===============================
    @Override
    public EmployeeResponse getMyProfile() {

        String email = getLoggedInEmail();

        Employee emp = employeeRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return mapToEmployeeResponse(emp);
    }

    // ===============================
    // GET ALL EMPLOYEES
    // ===============================
    @Override
    public Page<EmployeeResponse> getAllEmployees(int page, int size, String search) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Employee> employees =
                (search == null || search.isBlank())
                        ? employeeRepo.findAll(pageable)
                        : employeeRepo.findByUser_NameContainingIgnoreCaseOrUser_EmailContainingIgnoreCase(
                        search, search, pageable);

        return employees.map(this::mapToEmployeeResponse);
    }

    // ===============================
    // UPDATE MY PROFILE
    // ===============================
    @Override
    public EmployeeResponse updateMyProfile(EmployeeUpdateRequest request) {

        String email = getLoggedInEmail();

        Employee emp = employeeRepo.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (request.getName() != null) emp.getUser().setName(request.getName());
        if (request.getAge() != null) emp.getUser().setAge(request.getAge());
        if (request.getGender() != null) emp.getUser().setGender(request.getGender());

        return mapToEmployeeResponse(emp);
    }

    // ===============================
    // CORE MAPPER (FIXED)
    // ===============================
    private EmployeeResponse mapToEmployeeResponse(Employee emp) {

        List<ImageResponse> images =
                imageRepository.findAllByUser_UserId(emp.getUser().getUserId())
                        .stream()
                        .map(img -> new ImageResponse(img.getImageId(), img.getFileName()))
                        .toList();

        return new EmployeeResponse(
                emp.getEmpId(),
                emp.getUser().getName(),
                emp.getUser().getEmail(),
                emp.getDepartment() != null ? emp.getDepartment().getDeptName() : null,
                emp.getDepartment() != null ? emp.getDepartment().getDeptId() : null,
                images,   // ✅ ALWAYS FROM USER
                emp.getUser().getAge(),
                emp.getUser().getGender(),
                emp.getUser().getStatus()
        );
    }


    // ===============================
    // GET EMPLOYEE BY ID
    // ===============================
    @Override
    public EmployeeResponse getEmployeeByIdResponse(Integer empId) {

        Employee emp = employeeRepo.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (!isAdmin() && !"APPROVED".equals(emp.getUser().getStatus())) {
            throw new RuntimeException("Employee not approved");
        }

        return mapToEmployeeResponse(emp);
    }

    // ===============================
    // ADMIN: GET ALL USERS
    // ===============================
    @Override
    public List<AdminEmployeeResponse> getAllUsersForAdmin() {

        return userRepository.findAll().stream().map(user -> {

            AdminEmployeeResponse res = new AdminEmployeeResponse();
            res.setUserId(user.getUserId());
            res.setName(user.getName());
            res.setEmail(user.getEmail());
            res.setAge(user.getAge());
            res.setGender(user.getGender());
            res.setStatus(user.getStatus());

            // 🔥 IMAGES ALWAYS FROM USER
            res.setImages(
                    imageRepository.findAllByUser_UserId(user.getUserId())
                            .stream()
                            .map(img -> new ImageResponse(img.getImageId(), img.getFileName()))
                            .toList()
            );

            employeeRepo.findByUser_UserId(user.getUserId())
                    .ifPresent(emp -> {
                        res.setEmpId(emp.getEmpId());
                        if (emp.getDepartment() != null) {
                            res.setDeptId(emp.getDepartment().getDeptId());
                            res.setDepartment(emp.getDepartment().getDeptName());
                        }
                    });

            return res;
        }).toList();
    }

    // ===============================
    // ADMIN: GET USER
    // ===============================
    @Override
    public AdminEmployeeResponse getUserForAdmin(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AdminEmployeeResponse res = new AdminEmployeeResponse();
        res.setUserId(user.getUserId());
        res.setName(user.getName());
        res.setEmail(user.getEmail());
        res.setAge(user.getAge());
        res.setGender(user.getGender());
        res.setStatus(user.getStatus());

        // 🔥 ALWAYS FETCH USER IMAGES
        res.setImages(
                imageRepository.findAllByUser_UserId(userId)
                        .stream()
                        .map(img -> new ImageResponse(img.getImageId(), img.getFileName()))
                        .toList()
        );

        employeeRepo.findByUser_UserId(userId)
                .ifPresent(emp -> {
                    res.setEmpId(emp.getEmpId());
                    if (emp.getDepartment() != null) {
                        res.setDeptId(emp.getDepartment().getDeptId());
                        res.setDepartment(emp.getDepartment().getDeptName());
                    }
                });

        return res;
    }

    // ===============================
    // ADMIN: UPDATE USER
    // ===============================
    @Override
    public AdminEmployeeResponse adminUpdateUser(
            Integer userId,
            AdminEmployeeUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getGender() != null) user.setGender(request.getGender());

        if (request.getStatus() != null) {

            // ✅ APPROVED
            if ("APPROVED".equals(request.getStatus())) {

                if (request.getDeptId() == null) {
                    throw new RuntimeException("Department required to approve user");
                }

                user.setStatus("APPROVED");
                user.setEnabled(true);

                Department dept = deptRepo.findById(request.getDeptId())
                        .orElseThrow(() -> new RuntimeException("Department not found"));

                Employee employee = employeeRepo.findByUser_UserId(userId)
                        .orElseGet(() -> {
                            Employee emp = new Employee();
                            emp.setUser(user);
                            emp.setDepartment(dept);
                            return employeeRepo.saveAndFlush(emp);
                        });

                employee.setDepartment(dept);
                employeeRepo.saveAndFlush(employee);
            }

            // ❌ REJECTED
            if ("REJECTED".equals(request.getStatus())) {

                user.setStatus("REJECTED");
                user.setEnabled(false);

                employeeRepo.findByUser_UserId(userId)
                        .ifPresent(emp -> {
                            employeeRepo.delete(emp);
                            employeeRepo.flush();
                        });
            }

            // ⏳ PENDING
            if ("PENDING".equals(request.getStatus())) {

                user.setStatus("PENDING");
                user.setEnabled(false);

                employeeRepo.findByUser_UserId(userId)
                        .ifPresent(emp -> {
                            employeeRepo.delete(emp);
                            employeeRepo.flush();
                        });
            }
        }

        userRepository.saveAndFlush(user);
        return getUserForAdmin(userId);
    }

    // ===============================
    // DELETE EMPLOYEE
    // ===============================
    @Override
    public void deleteEmployee(Integer empId) {
        employeeRepo.deleteById(empId);
    }
}
