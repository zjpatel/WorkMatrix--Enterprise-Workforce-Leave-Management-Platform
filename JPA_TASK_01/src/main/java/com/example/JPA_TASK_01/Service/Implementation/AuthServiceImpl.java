package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.DTO.Auth.LoginRequest;
import com.example.JPA_TASK_01.DTO.Auth.LoginResponse;
import com.example.JPA_TASK_01.DTO.Auth.RegisterRequest;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Exception.DuplicateEmailException;
import com.example.JPA_TASK_01.Exception.UserNotApprovedException;
import com.example.JPA_TASK_01.Exception.UserRejectedException;
import com.example.JPA_TASK_01.Mapper.UserMapper;
import com.example.JPA_TASK_01.Repo.UserRepository;
import com.example.JPA_TASK_01.Service.AuthService;
import com.example.JPA_TASK_01.util.JWTutil;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.JPA_TASK_01.Entity.Images;
import com.example.JPA_TASK_01.Repo.ImageRepository;

import java.awt.*;


@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JWTutil jwTutil;
    private final AuthenticationManager authenticationManager;
    private final ImageStorageService imageStorageService;

    private final ImageRepository imageRepo;

    public AuthServiceImpl(
            UserRepository userRepo,
            PasswordEncoder passwordEncoder,
            JWTutil jwTutil,
            AuthenticationManager authenticationManager,
            ImageStorageService imageStorageService, ImageRepository imageRepo) {

        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwTutil = jwTutil;
        this.authenticationManager = authenticationManager;
        this.imageStorageService = imageStorageService;
        this.imageRepo = imageRepo;
    }

    @Override
    public UserResponse register(RegisterRequest request, MultipartFile image) {


        System.out.println("IMAGE RECEIVED = " + (image != null));
        if (image != null) {
            System.out.println("IMAGE NAME = " + image.getOriginalFilename());
            System.out.println("IMAGE SIZE = " + image.getSize());
        }


        if (userRepo.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        user.setGender(request.getGender());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("EMPLOYEE");
        user.setStatus("PENDING");
        user.setEnabled(false);

        User savedUser = userRepo.save(user);

        // 🔥 THIS WAS MISSING
        if (image != null && !image.isEmpty()) {
            Images img = imageStorageService.storeUserImage(image, savedUser);
            imageRepo.save(img);   // ✅ ACTUALLY SAVE TO DB
        }

        return UserMapper.toResponse(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("REJECTED".equals(user.getStatus())) {
            throw new UserRejectedException("User account has been rejected");
        }

        if (!user.isEnabled() || "PENDING".equals(user.getStatus())) {
            throw new UserNotApprovedException("User not approved yet");
        }

        String token = jwTutil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new LoginResponse(token, user.getRole());
    }
}
