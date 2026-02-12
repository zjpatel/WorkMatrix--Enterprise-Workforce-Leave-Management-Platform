package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.DTO.User.AdminProfileUpdateRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Mapper.UserMapper;
import com.example.JPA_TASK_01.Repo.UserRepository;
import com.example.JPA_TASK_01.Service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepo;

    public UserServiceImpl(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // ❌ REMOVE createUser FROM PUBLIC API
    // User creation must happen via AuthService

    @Override
    public UserResponse getUserById(Integer userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse getUserByEmail(String email) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.toResponse(user);
    }

    @Override
    public List<UserResponse> getUsersByStatus(String status) {

        return userRepo.findByStatus(status)
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @Override
    public void enableUser(Integer userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
    }

    @Override
    public void disableUser(Integer userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(false);
    }

    public UserResponse getMyProfile() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.toResponse(user);
    }

    public UserResponse updateMyProfile(AdminProfileUpdateRequest request) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null)
            user.setName(request.getName());

        if (request.getAge() != null)
            user.setAge(request.getAge());

        if (request.getGender() != null)
            user.setGender(request.getGender());

        return UserMapper.toResponse(user);
    }

}
