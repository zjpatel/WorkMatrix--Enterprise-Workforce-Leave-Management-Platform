package com.example.JPA_TASK_01.Entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "images")
public class Images {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long imageId;

  private String fileName;
  private String filePath;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private User user;


  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "emp_id")
  @JsonIgnore
  private Employee employee;

  private LocalDateTime uploadedAt = LocalDateTime.now();

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Long getImageId() {
    return imageId;
  }

  public void setImageId(Long imageId) {
    this.imageId = imageId;
  }

  public String getFileName() {
    return fileName;
  }

  public void setFileName(String fileName) {
    this.fileName = fileName;
  }

  public String getFilePath() {
    return filePath;
  }

  public void setFilePath(String filePath) {
    this.filePath = filePath;
  }

  public Employee getEmployee() {
    return employee;
  }

  public void setEmployee(Employee employee) {
    this.employee = employee;
  }

  public LocalDateTime getUploadedAt() {
    return uploadedAt;
  }

  public void setUploadedAt(LocalDateTime uploadedAt) {
    this.uploadedAt = uploadedAt;
  }

}

