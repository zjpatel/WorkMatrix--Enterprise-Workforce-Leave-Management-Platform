package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.User.AdminProfileUpdateRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponse getUserById(Integer userId);

    UserResponse getUserByEmail(String email);

    List<UserResponse> getUsersByStatus(String status);

    void enableUser(Integer userId);

    void disableUser(Integer userId);

    UserResponse updateMyProfile(AdminProfileUpdateRequest request);

    UserResponse getMyProfile();
}

