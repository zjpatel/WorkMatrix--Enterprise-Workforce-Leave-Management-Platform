package com.example.JPA_TASK_01;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JpaTask01Application {

  @Autowired
  private PasswordEncoder passwordEncoder;
  public static void main(String[] args) {

    SpringApplication.run(JpaTask01Application.class, args);

  }

  @PostConstruct
  public void generateAdminPassword() {
    System.out.println(passwordEncoder.encode("admin123"));
  }

}

