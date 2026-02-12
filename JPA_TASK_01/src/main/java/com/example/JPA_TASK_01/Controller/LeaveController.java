package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.LeaveRequest.ApplyLeaveRequest;
import com.example.JPA_TASK_01.DTO.LeaveRequest.EditLeaveRequest;
import com.example.JPA_TASK_01.DTO.LeaveRequest.LeaveResponse;
import com.example.JPA_TASK_01.Service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // EMPLOYEE: APPLY LEAVE
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveResponse> applyLeave(
            @RequestBody ApplyLeaveRequest request) {

        return ResponseEntity.ok(
                leaveService.applyLeave(request)
        );
    }

    // EMPLOYEE: VIEW OWN LEAVES
    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<List<LeaveResponse>> getMyLeaves() {

        return ResponseEntity.ok(
                leaveService.getMyLeaves()
        );
    }

    // EMPLOYEE: EDIT PENDING LEAVE
    @PatchMapping("/{leaveId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<LeaveResponse> editLeave(
            @PathVariable int leaveId,
            @RequestBody EditLeaveRequest request) {

        return ResponseEntity.ok(
                leaveService.editLeave(leaveId, request)
        );
    }

    // ADMIN: VIEW PENDING LEAVES
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveResponse>> getPendingLeaves() {

        return ResponseEntity.ok(
                leaveService.getPendingLeaves()
        );
    }

    // ADMIN: APPROVE / REJECT LEAVE
    @PutMapping("/{leaveId}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveResponse> decideLeave(
            @PathVariable Integer leaveId,
            @RequestParam String decision) {

        return ResponseEntity.ok(
                leaveService.decideLeave(leaveId, decision)
        );
    }

    // ===============================
// ADMIN: REVOKE APPROVED LEAVE
// ===============================
    @PutMapping("/{leaveId}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeaveResponse> revokeLeave(
            @PathVariable int leaveId) {

        return ResponseEntity.ok(
                leaveService.revokeLeave(leaveId)
        );
    }

    @DeleteMapping("/{leaveId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Void> deleteLeave(@PathVariable int leaveId) {
        leaveService.deletePendingLeave(leaveId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LeaveResponse>> searchLeavesForAdmin(
            @RequestParam(required = false) Integer empId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String leaveType,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate
    ) {
        return ResponseEntity.ok(
                leaveService.filterLeavesForAdmin(
                        empId, status, leaveType, year, fromDate, toDate
                )
        );
    }


}

