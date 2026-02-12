package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.User.AdminProfileUpdateRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/profile")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProfileController {

    private final UserService userService;

    public AdminProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody AdminProfileUpdateRequest request) {

        return ResponseEntity.ok(userService.updateMyProfile(request));
    }
}
