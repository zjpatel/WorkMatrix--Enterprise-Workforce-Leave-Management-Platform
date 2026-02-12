package com.example.JPA_TASK_01.Repo;

import com.example.JPA_TASK_01.Entity.EmailLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Integer> {}
