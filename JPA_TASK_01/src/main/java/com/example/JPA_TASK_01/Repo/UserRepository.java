package com.example.JPA_TASK_01.Repo;

import java.util.List;
import java.util.Optional;

import com.example.JPA_TASK_01.DTO.Employee.AdminEmployeeResponse;
import com.example.JPA_TASK_01.Entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

  Optional<User> findByEmail(String email);

  boolean existsByEmail(String email);

  List<User> findByStatus(String status);

  List<User> findAll();
}
