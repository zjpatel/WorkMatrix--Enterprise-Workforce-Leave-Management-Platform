package com.example.JPA_TASK_01.Exception;

public class DuplicateEmailException extends RuntimeException {
  public DuplicateEmailException(String message) {
    super(message);
  }
}
