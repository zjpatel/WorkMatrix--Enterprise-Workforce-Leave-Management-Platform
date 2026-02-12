package com.example.JPA_TASK_01.Repo;

import com.example.JPA_TASK_01.Entity.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Images, Long> {

  // ✅ ALWAYS use findAllBy... (important)
  List<Images> findAllByUser_UserId(Integer userId);

  Optional<Images> findByImageId(Long imageId);

  Optional<Images> findByFileName(String fileName);
}
