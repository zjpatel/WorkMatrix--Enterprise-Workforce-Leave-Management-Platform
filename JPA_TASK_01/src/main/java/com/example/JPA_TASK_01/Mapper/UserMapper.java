package com.example.JPA_TASK_01.Mapper;

import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import com.example.JPA_TASK_01.DTO.User.UserResponse;
import com.example.JPA_TASK_01.Entity.User;

import java.util.List;

public class UserMapper {

    private UserMapper() {
        // prevent instantiation
    }

    public static UserResponse toResponse(User user) {

        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getStatus(),
                user.isEnabled(),
                user.getAge(),
                user.getGender()
        );

        // ✅ MAP IMAGES AS API PATHS
        if (user.getImages() != null && !user.getImages().isEmpty()) {

            List<ImageResponse> images = user.getImages()
                    .stream()
                    .map(img -> new ImageResponse(
                            img.getImageId(),
                            "/api/images/" + img.getFileName()
                    ))
                    .toList();

            response.setImages(images);
        }

        return response;
    }
}
