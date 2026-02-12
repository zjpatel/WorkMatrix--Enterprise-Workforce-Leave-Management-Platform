package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.Auth.LoginRequest;
import com.example.JPA_TASK_01.DTO.Auth.LoginResponse;
import com.example.JPA_TASK_01.DTO.Auth.RegisterRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface AuthService {

     UserResponse register(RegisterRequest request, MultipartFile image);
     LoginResponse login(LoginRequest request);

}
