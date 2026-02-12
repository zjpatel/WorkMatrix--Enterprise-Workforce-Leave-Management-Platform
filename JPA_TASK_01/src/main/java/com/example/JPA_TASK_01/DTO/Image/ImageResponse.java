package com.example.JPA_TASK_01.DTO.Image;

public class ImageResponse {

    private Long imageId;
    private String fileName;

    public ImageResponse(Long imageId, String fileName) {
        this.imageId = imageId;
        this.fileName = fileName;
    }

    public Long getImageId() {
        return imageId;
    }

    public String getFileName() {
        return fileName;
    }
}
