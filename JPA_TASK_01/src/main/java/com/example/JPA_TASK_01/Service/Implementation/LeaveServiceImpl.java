package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.DTO.LeaveRequest.ApplyLeaveRequest;
import com.example.JPA_TASK_01.DTO.LeaveRequest.EditLeaveRequest;
import com.example.JPA_TASK_01.DTO.LeaveRequest.LeaveResponse;
import com.example.JPA_TASK_01.Entity.Employee;
import com.example.JPA_TASK_01.Entity.LeaveRequest;
import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Mapper.LeaveMapper;
import com.example.JPA_TASK_01.Repo.EmployeeRepository;
import com.example.JPA_TASK_01.Repo.LeaveRequestRepository;
import com.example.JPA_TASK_01.Repo.UserRepository;
import com.example.JPA_TASK_01.Service.LeaveService;
import com.example.JPA_TASK_01.Specification.LeaveRequestSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveServiceImpl implements LeaveService {

  private final LeaveRequestRepository leaveRequestRepository;
  private final EmployeeRepository employeeRepository;
  private final UserRepository userRepository;

  public LeaveServiceImpl(
          LeaveRequestRepository leaveRequestRepository,
          EmployeeRepository employeeRepository,
          UserRepository userRepository) {
    this.leaveRequestRepository = leaveRequestRepository;
    this.employeeRepository = employeeRepository;
    this.userRepository = userRepository;
  }

  // ===============================
  // APPLY LEAVE
  // ===============================
  @Override
  public LeaveResponse applyLeave(ApplyLeaveRequest request) {

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User user = userRepository.findByEmail(email).orElseThrow();
    Employee employee = employeeRepository
            .findByUser_UserId(user.getUserId())
            .orElseThrow(() -> new RuntimeException("Employee not Found"));

    LocalDate startDate = request.getStartDate();
    LocalDate endDate = request.getEndDate();

    if (startDate == null || endDate == null) {
      throw new RuntimeException("StartDate or EndDate cant be null");
    }

    if (startDate.isAfter(endDate)) {
      throw new RuntimeException("End date can't be before start date");
    }

    int totalDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;

    int yearlyLimit;
    String leaveType = request.getLeaveType();

    if (leaveType.equalsIgnoreCase("SICK")) yearlyLimit = 8;
    else if (leaveType.equalsIgnoreCase("CASUAL")) yearlyLimit = 6;
    else if (leaveType.equalsIgnoreCase("EARNED")) yearlyLimit = 12;
    else if (leaveType.equalsIgnoreCase("OPTIONAL")) yearlyLimit = 3;
    else if (leaveType.equalsIgnoreCase("UNPAID")) yearlyLimit = 0;
    else throw new RuntimeException("Invalid leave type");

    int usedPaidDays = leaveRequestRepository.getUsedPaidDays(
            employee.getEmpId(),
            leaveType,
            startDate.getYear()
    );

    int remainingPaidDays = Math.max(0, yearlyLimit - usedPaidDays);

    int paidDays = 0;
    int unpaidDays = 0;

    if (remainingPaidDays <= 0) {
      unpaidDays = totalDays;
    } else if (remainingPaidDays >= totalDays) {
      paidDays = totalDays;
    } else {
      paidDays = remainingPaidDays;
      unpaidDays = totalDays - paidDays;
    }

    LeaveRequest leaveRequest = new LeaveRequest();
    leaveRequest.setEmployee(employee);
    leaveRequest.setLeaveType(leaveType);
    leaveRequest.setStartDate(startDate);
    leaveRequest.setEndDate(endDate);
    leaveRequest.setTotalDays(totalDays);
    leaveRequest.setPaidDays(paidDays);
    leaveRequest.setUnpaidDays(unpaidDays);
    leaveRequest.setYear(startDate.getYear());
    leaveRequest.setStatus("PENDING");
    leaveRequest.setAppliedAt(LocalDateTime.now());
    leaveRequest.setReason(request.getReason());

    return LeaveMapper.toResponse(
            leaveRequestRepository.save(leaveRequest)
    );
  }

  // ===============================
  // EMPLOYEE: VIEW OWN LEAVES
  // ===============================
  @Override
  public List<LeaveResponse> getMyLeaves() {

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User user = userRepository.findByEmail(email).orElseThrow();
    Employee emp = employeeRepository.findByUser_UserId(user.getUserId()).orElseThrow();

    return leaveRequestRepository.findByEmployee_EmpId(emp.getEmpId())
            .stream()
            .map(LeaveMapper::toResponse)
            .toList();
  }

  // ===============================
  // ADMIN: DECIDE LEAVE
  // ===============================
  @Override
  public LeaveResponse decideLeave(Integer leaveId, String decision) {

    LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
            .orElseThrow(() -> new RuntimeException("Leave not found"));

    if (!leaveRequest.getStatus().equalsIgnoreCase("PENDING")) {
      throw new RuntimeException("Leave already processed");
    }

    if (!decision.equalsIgnoreCase("APPROVED")
            && !decision.equalsIgnoreCase("REJECTED")) {
      throw new RuntimeException("Invalid decision");
    }

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User admin = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

    leaveRequest.setStatus(decision.toUpperCase());
    leaveRequest.setApprovedAt(LocalDateTime.now());
    leaveRequest.setApprovedBy(admin);

    return LeaveMapper.toResponse(
            leaveRequestRepository.save(leaveRequest)
    );
  }

  // ===============================
  // ADMIN: VIEW PENDING LEAVES
  // ===============================
  @Override
  public List<LeaveResponse> getPendingLeaves() {
    return leaveRequestRepository.findByStatus("PENDING")
            .stream()
            .map(LeaveMapper::toResponse)
            .toList();
  }

  // ===============================
  // EMPLOYEE: EDIT PENDING LEAVE
  // ===============================
  @Override
  public LeaveResponse editLeave(int leaveId, EditLeaveRequest editLeaveRequest) {

    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User user = userRepository.findByEmail(email).orElseThrow();
    Employee emp = employeeRepository.findByUser_UserId(user.getUserId()).orElseThrow();

    LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
            .orElseThrow(() -> new RuntimeException("Leave not found"));

    if (!leaveRequest.getEmployee().getEmpId().equals(emp.getEmpId())) {
      throw new RuntimeException("You are not allowed to edit this leave");
    }

    if (!leaveRequest.getStatus().equalsIgnoreCase("PENDING")) {
      throw new RuntimeException("Only PENDING leaves can be edited");
    }

    LocalDate startDate = editLeaveRequest.getStartDate() != null
            ? editLeaveRequest.getStartDate()
            : leaveRequest.getStartDate();

    LocalDate endDate = editLeaveRequest.getEndDate() != null
            ? editLeaveRequest.getEndDate()
            : leaveRequest.getEndDate();


    if (startDate.isAfter(endDate)) {
      throw new RuntimeException("End date cannot be before start date");
    }

    int totalDays = (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;

    String leaveType = editLeaveRequest.getLeaveType() != null
            ? editLeaveRequest.getLeaveType()
            : leaveRequest.getLeaveType();

    int yearlyLimit;
    if (leaveType.equalsIgnoreCase("SICK")) yearlyLimit = 8;
    else if (leaveType.equalsIgnoreCase("CASUAL")) yearlyLimit = 6;
    else if (leaveType.equalsIgnoreCase("EARNED")) yearlyLimit = 12;
    else if (leaveType.equalsIgnoreCase("OPTIONAL")) yearlyLimit = 3;
    else if (leaveType.equalsIgnoreCase("UNPAID")) yearlyLimit = 0;
    else throw new RuntimeException("Invalid leave type");

    int usedPaidDays = leaveRequestRepository.getUsedPaidDays(
            emp.getEmpId(),
            leaveType,
            startDate.getYear()
    ) - leaveRequest.getPaidDays();

    if (usedPaidDays < 0) {
      usedPaidDays = 0;
    }

    int remainingPaidDays = Math.max(0, yearlyLimit - usedPaidDays);

    int paidDays = 0;
    int unpaidDays = 0;

    if (remainingPaidDays <= 0) unpaidDays = totalDays;
    else if (remainingPaidDays >= totalDays) paidDays = totalDays;
    else {
      paidDays = remainingPaidDays;
      unpaidDays = totalDays - paidDays;
    }

    leaveRequest.setLeaveType(leaveType);
    leaveRequest.setStartDate(startDate);
    leaveRequest.setEndDate(endDate);
    leaveRequest.setTotalDays(totalDays);
    leaveRequest.setPaidDays(paidDays);
    leaveRequest.setUnpaidDays(unpaidDays);
    leaveRequest.setYear(startDate.getYear());
    leaveRequest.setReason(editLeaveRequest.getReason());

    return LeaveMapper.toResponse(
            leaveRequestRepository.save(leaveRequest)
    );
  }

  @Override
  public LeaveResponse revokeLeave(int leaveId) {

      LeaveRequest leaveRequest=leaveRequestRepository.findById(leaveId).orElseThrow(()-> new RuntimeException("Leave not found"));
      if (!"APPROVED".equalsIgnoreCase(leaveRequest.getStatus())
      )
      {
          throw new RuntimeException("Only APPROVED leaves can be revoked");
      }

      if (!LocalDate.now().isBefore(leaveRequest.getStartDate()))
      {
        throw new RuntimeException("Leave has already started can't revoke now!");
      }

      String email=SecurityContextHolder.getContext().getAuthentication().getName();
      User admin=userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("Admin not found!"));

      leaveRequest.setStatus("REVOKED");
      leaveRequest.setApprovedAt(LocalDateTime.now());
      leaveRequest.setApprovedBy(admin);

      return LeaveMapper.toResponse(leaveRequestRepository.save(leaveRequest));
  }

  @Override
  public void deletePendingLeave(int leaveId) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User user = userRepository.findByEmail(email).orElseThrow();
    Employee emp = employeeRepository.findByUser_UserId(user.getUserId()).orElseThrow();

    LeaveRequest leave = leaveRequestRepository.findById(leaveId)
            .orElseThrow(() -> new RuntimeException("Leave not found"));

    if (!leave.getEmployee().getEmpId().equals(emp.getEmpId())) {
      throw new RuntimeException("Not allowed");
    }

    if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
      throw new RuntimeException("Only PENDING leaves can be deleted");
    }

    leaveRequestRepository.delete(leave);
  }


  @Override
  public List<LeaveResponse> filterLeavesForAdmin(
          Integer empId,
          String status,
          String leaveType,
          Integer year,
          LocalDate fromDate,
          LocalDate toDate
  ) {

    Specification<LeaveRequest> spec =
            Specification
                    .allOf(LeaveRequestSpecification.hasEmpId(empId))
                    .and(LeaveRequestSpecification.hasStatus(status))
                    .and(LeaveRequestSpecification.hasLeaveType(leaveType))
                    .and(LeaveRequestSpecification.hasYear(year))
                    .and(LeaveRequestSpecification.startDateFrom(fromDate))
                    .and(LeaveRequestSpecification.endDateTo(toDate));

    return leaveRequestRepository.findAll(spec)
            .stream()
            .map(LeaveMapper::toResponse)
            .toList();
  }

}
