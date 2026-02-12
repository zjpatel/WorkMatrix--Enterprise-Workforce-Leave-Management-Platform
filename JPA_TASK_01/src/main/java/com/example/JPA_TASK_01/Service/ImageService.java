package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {

    ImageResponse uploadUserImage(Integer userId, MultipartFile file);
    ImageResponse uploadEmployeeImage(Integer empId, MultipartFile file);

    // read
    Resource getImageById(Long imageId);
    Resource getImageByFileName(String fileName);

    // delete
    void deleteImageById(Long imageId);
    void deleteImageByFileName(String fileName);

    List<ImageResponse> uploadImages(Integer empId, List<MultipartFile> images);

    List<ImageResponse> uploadUserImages(Integer userId, List<MultipartFile> images);



}
