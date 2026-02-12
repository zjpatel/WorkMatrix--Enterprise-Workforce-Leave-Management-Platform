package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.Auth.LoginRequest;
import com.example.JPA_TASK_01.DTO.Auth.LoginResponse;
import com.example.JPA_TASK_01.DTO.Auth.RegisterRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Service.AuthService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  // ===============================
  // REGISTER (PUBLIC)
  // ===============================
  @PostMapping(
          value = "/register",
          consumes = MediaType.MULTIPART_FORM_DATA_VALUE
  )
  public ResponseEntity<UserResponse> register(
          @RequestPart("data") RegisterRequest request,
          @RequestPart(value = "image", required = false) MultipartFile image
  ) {
    UserResponse response = authService.register(request, image);
    return ResponseEntity.ok(response);
  }

  // ===============================
  // LOGIN
  // ===============================
  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(
          @RequestBody LoginRequest request
  ) {
    LoginResponse response = authService.login(request);
    return ResponseEntity.ok(response);
  }
}
