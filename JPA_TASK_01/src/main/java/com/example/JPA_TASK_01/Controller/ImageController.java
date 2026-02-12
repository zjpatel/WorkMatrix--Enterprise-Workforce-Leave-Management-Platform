package com.example.JPA_TASK_01.Controller;

import com.example.JPA_TASK_01.DTO.Image.ImageResponse;
import com.example.JPA_TASK_01.Service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {

  private final ImageService imageService;

  public ImageController(ImageService imageService) {
    this.imageService = imageService;
  }

  // ===============================
  // GET IMAGE BY IMAGE ID
  // ===============================
  @GetMapping("/{imageId}")
  public ResponseEntity<Resource> getImageById(
          @PathVariable Long imageId) {

    Resource resource = imageService.getImageById(imageId);
    return ResponseEntity.ok(resource);
  }

  // ===============================
  // GET IMAGE BY FILE NAME
  // ===============================
  @GetMapping("/by-name/{fileName}")
  public ResponseEntity<Resource> getImageByFileName(
          @PathVariable String fileName) {

    Resource resource = imageService.getImageByFileName(fileName);
    return ResponseEntity.ok(resource);
  }

  // ===============================
  // DELETE IMAGE BY IMAGE ID
  // ===============================
  @DeleteMapping("/{imageId}")
  public ResponseEntity<Void> deleteImageById(
          @PathVariable Long imageId) {

    imageService.deleteImageById(imageId);
    return ResponseEntity.noContent().build();
  }

  // ===============================
  // DELETE IMAGE BY FILE NAME
  // ===============================
  @DeleteMapping("/by-name/{fileName}")
  public ResponseEntity<Void> deleteImageByFileName(
          @PathVariable String fileName) {

    imageService.deleteImageByFileName(fileName);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/upload/{empId}")
  public ResponseEntity<List<ImageResponse>> uploadImages(
          @PathVariable Integer empId,
          @RequestParam("images") List<MultipartFile> images) {

    return ResponseEntity.ok(
            imageService.uploadImages(empId, images)
    );
  }

  @PostMapping("/upload/user/{userId}")
  public ResponseEntity<List<ImageResponse>> uploadUserImages(
          @PathVariable Integer userId,
          @RequestParam("images") List<MultipartFile> images) {

    return ResponseEntity.ok(
            imageService.uploadUserImages(userId, images)
    );
  }


}
