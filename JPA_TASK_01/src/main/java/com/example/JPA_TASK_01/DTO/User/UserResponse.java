package com.example.JPA_TASK_01.DTO.User;

import com.example.JPA_TASK_01.DTO.Image.ImageResponse;

import java.util.List;

public class UserResponse {

    private Integer userId;
    private String name;
    private String email;
    private String role;
    private String status;
    private Boolean enabled;
    private Integer age;
    private String gender;

    private List<ImageResponse> images;

    public UserResponse(
            Integer userId,
            String name,
            String email,
            String role,
            String status,
            Boolean enabled,
            Integer age,
            String gender) {

        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
        this.enabled = enabled;
        this.age=age;
        this.gender=gender;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Integer getAge() {
        return age;
    }
    public List<ImageResponse> getImages() {
        return images;
    }

    public void setImages(List<ImageResponse> images) {
        this.images = images;
    }


    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getStatus() {
        return status;
    }

    public Boolean getEnabled() {
        return enabled;
    }
}
