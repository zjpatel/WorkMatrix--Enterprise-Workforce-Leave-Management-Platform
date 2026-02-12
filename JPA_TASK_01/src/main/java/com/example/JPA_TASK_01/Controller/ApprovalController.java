package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.Approval.ApprovalRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Service.ApprovalService;
import com.example.JPA_TASK_01.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/approval")
public class ApprovalController {

    private final ApprovalService approvalService;
    private final UserService userService;

    public ApprovalController(
            ApprovalService approvalService,
            UserService userService) {
        this.approvalService = approvalService;
        this.userService = userService;
    }

    // ===============================
    // GET ALL PENDING USERS (ADMIN)
    // ===============================
    @GetMapping("/pending")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {

        List<UserResponse> pendingUsers =
                userService.getUsersByStatus("PENDING");

        return ResponseEntity.ok(pendingUsers);
    }

    // ===============================
    // APPROVE USER (ADMIN)
    // ===============================
    @PostMapping("/approve")
    public ResponseEntity<String> approveUser(
            @RequestBody ApprovalRequest request) {

        approvalService.approveUser(request);
        return ResponseEntity.ok("User approved successfully");
    }

    // ===============================
    // REJECT USER (ADMIN)
    // ===============================
    @PostMapping("/reject/{userId}")
    public ResponseEntity<String> rejectUser(
            @PathVariable Integer userId) {

        approvalService.rejectUser(userId);
        return ResponseEntity.ok("User rejected successfully");
    }

    // ===============================
// REOPEN REJECTED USER (ADMIN)
// ===============================
    @PostMapping("/reopen/{userId}")
    public ResponseEntity<String> reopenUser(
            @PathVariable Integer userId) {

        approvalService.reopenUser(userId);
        return ResponseEntity.ok("User reopened and moved to PENDING");
    }

}
