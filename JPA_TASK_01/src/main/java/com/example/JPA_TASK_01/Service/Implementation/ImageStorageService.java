package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.Entity.Employee;
import com.example.JPA_TASK_01.Entity.Images;
import com.example.JPA_TASK_01.Entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class ImageStorageService {

  @Value("${image.upload.dir}")
  private String uploadDir;

  // ===============================
  // COMMON VALIDATION
  // ===============================
  private void validateImage(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new RuntimeException("Empty file not allowed");
    }

    if (file.getContentType() == null ||
            !file.getContentType().startsWith("image/")) {
      throw new RuntimeException("Only image files are allowed");
    }
  }

  private String saveFileToDisk(MultipartFile file) throws IOException {

    Path baseDir = Paths.get(uploadDir);
    Files.createDirectories(baseDir);

    String uniqueFileName =
            UUID.randomUUID() + "_" + file.getOriginalFilename();

    Path filePath = baseDir.resolve(uniqueFileName);

    Files.copy(
            file.getInputStream(),
            filePath,
            StandardCopyOption.REPLACE_EXISTING
    );

    return filePath.toString();
  }

  // ===============================
  // STORE IMAGE FOR USER (PENDING)
  // ===============================
  public Images storeUserImage(MultipartFile file, User user) {

    try {
      validateImage(file);

      String path = saveFileToDisk(file);

      Images image = new Images();
      image.setFileName(Paths.get(path).getFileName().toString());
      image.setFilePath(path);
      image.setUser(user);     // 🔑 linked to USER
      image.setEmployee(null);

      return image;

    } catch (IOException e) {
      throw new RuntimeException("Failed to store user image", e);
    }
  }
  public void deletePhysicalFile(String filePath) {

    if (filePath == null || filePath.isBlank()) return;

    try {
      Files.deleteIfExists(Paths.get(filePath));
    } catch (IOException e) {
      throw new RuntimeException("Failed to delete image file", e);
    }
  }


}
