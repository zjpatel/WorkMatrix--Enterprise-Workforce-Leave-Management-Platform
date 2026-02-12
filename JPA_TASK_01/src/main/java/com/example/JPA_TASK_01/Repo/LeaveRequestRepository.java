package com.example.JPA_TASK_01.Repo;

import com.example.JPA_TASK_01.Entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends  JpaRepository<LeaveRequest, Integer>,
        JpaSpecificationExecutor<LeaveRequest> {

  @Query(
      "SELECT COALESCE( SUM(l.paidDays),0) FROM LeaveRequest l WHERE l.employee.empId=:empId AND l.leaveType=:leaveType AND l.year=:year AND l.status='APPROVED'")
  Integer getUsedPaidDays(
          Integer empId,
          String leaveType,
          Integer year
  );

  List<LeaveRequest> findByEmployee_EmpId(Integer empId);
  List<LeaveRequest> findByStatus(String status);


}
