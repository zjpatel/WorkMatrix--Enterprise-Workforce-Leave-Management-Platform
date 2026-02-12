package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Service.UserService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  // ===============================
  // GET USER BY ID (ADMIN)
  // ===============================
  @GetMapping("/{userId}")
  public ResponseEntity<UserResponse> getUserById(@PathVariable Integer userId) {

    UserResponse user = userService.getUserById(userId);
    return ResponseEntity.ok(user);
  }

  // ===============================
  // GET USER BY EMAIL (ADMIN)
  // ===============================
  @GetMapping("/by-email")
  public ResponseEntity<UserResponse> getUserByEmail(@RequestParam String email) {

    UserResponse user = userService.getUserByEmail(email);
    return ResponseEntity.ok(user);
  }

  // ===============================
  // GET USERS BY STATUS (ADMIN)
  // ===============================
  @GetMapping
  public ResponseEntity<List<UserResponse>> getUsersByStatus(@RequestParam String status) {

    List<UserResponse> users = userService.getUsersByStatus(status);

    return ResponseEntity.ok(users);
  }

  // ===============================
  // ENABLE USER (ADMIN)
  // ===============================
  @PutMapping("/{userId}/enable")
  public ResponseEntity<String> enableUser(@PathVariable Integer userId) {

    userService.enableUser(userId);
    return ResponseEntity.ok("User enabled successfully");
  }

  // ===============================
  // DISABLE USER (ADMIN)
  // ===============================
  @PutMapping("/{userId}/disable")
  public ResponseEntity<String> disableUser(@PathVariable Integer userId) {

    userService.disableUser(userId);
    return ResponseEntity.ok("User disabled successfully");
  }
}
