package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import com.example.JPA_TASK_01.Entity.Employee;
import com.example.JPA_TASK_01.Entity.Images;
import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Repo.EmployeeRepository;
import com.example.JPA_TASK_01.Repo.ImageRepository;
import com.example.JPA_TASK_01.Repo.UserRepository;
import com.example.JPA_TASK_01.Service.ImageService;
import jakarta.transaction.Transactional;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ImageServiceImpl implements ImageService {

    private final UserRepository userRepo;
    private final EmployeeRepository employeeRepo;
    private final ImageRepository imageRepo;
    private final ImageStorageService storageService;

    public ImageServiceImpl(
            UserRepository userRepo,
            EmployeeRepository employeeRepo,
            ImageRepository imageRepo,
            ImageStorageService storageService) {

        this.userRepo = userRepo;
        this.employeeRepo = employeeRepo;
        this.imageRepo = imageRepo;
        this.storageService = storageService;
    }

    private Resource loadAsResource(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Resource resource = new UrlResource(path.toUri());

            if (!resource.exists()) {
                throw new RuntimeException("File not found on disk");
            }

            return resource;
        } catch (Exception e) {
            throw new RuntimeException("Failed to load image", e);
        }
    }

    // ===============================
    // UPLOAD IMAGES (EMP ENDPOINT – USER OWNERSHIP)
    // ===============================
    @Override
    public List<ImageResponse> uploadImages(Integer empId, List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            throw new RuntimeException("No images provided");
        }

        Employee employee = employeeRepo.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        User user = employee.getUser(); // 🔑 KEY FIX

        List<ImageResponse> responses = new ArrayList<>();

        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;

            Images image = storageService.storeUserImage(file, user);
            imageRepo.save(image);

            responses.add(
                    new ImageResponse(image.getImageId(), image.getFileName())
            );
        }

        return responses;
    }

    // ===============================
    // UPLOAD SINGLE USER IMAGE
    // ===============================
    @Override
    public ImageResponse uploadUserImage(Integer userId, MultipartFile file) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Images image = storageService.storeUserImage(file, user);
        imageRepo.save(image);

        return new ImageResponse(image.getImageId(), image.getFileName());
    }

    // ===============================
    // UPLOAD SINGLE EMPLOYEE IMAGE (STORED AS USER IMAGE)
    // ===============================
    @Override
    public ImageResponse uploadEmployeeImage(Integer empId, MultipartFile file) {

        Employee employee = employeeRepo.findById(empId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        User user = employee.getUser(); // 🔑 FIX

        Images image = storageService.storeUserImage(file, user);
        imageRepo.save(image);

        return new ImageResponse(image.getImageId(), image.getFileName());
    }

    // ===============================
    // FETCH IMAGE
    // ===============================
    @Override
    public Resource getImageById(Long imageId) {

        Images image = imageRepo.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        return loadAsResource(image.getFilePath());
    }

    @Override
    public Resource getImageByFileName(String fileName) {

        Images image = imageRepo.findByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        return loadAsResource(image.getFilePath());
    }

    // ===============================
    // DELETE IMAGE
    // ===============================
    @Override
    public void deleteImageById(Long imageId) {

        Images image = imageRepo.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        // ✅ DELETE FILE FIRST
        storageService.deletePhysicalFile(image.getFilePath());

        // ✅ DELETE ROW DIRECTLY (DO NOT NULL ANYTHING)
        imageRepo.delete(image);
    }


    @Override
    public void deleteImageByFileName(String fileName) {

        Images image = imageRepo.findByFileName(fileName)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        storageService.deletePhysicalFile(image.getFilePath());
        imageRepo.delete(image);
    }

    // ===============================
    // UPLOAD MULTIPLE USER IMAGES
    // ===============================
    @Override
    public List<ImageResponse> uploadUserImages(
            Integer userId,
            List<MultipartFile> images) {

        if (images == null || images.isEmpty()) {
            throw new RuntimeException("No images provided");
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ImageResponse> responses = new ArrayList<>();

        for (MultipartFile file : images) {
            if (file.isEmpty()) continue;

            Images image = storageService.storeUserImage(file, user);
            imageRepo.save(image);

            responses.add(
                    new ImageResponse(image.getImageId(), image.getFileName())
            );
        }

        return responses;
    }
}
