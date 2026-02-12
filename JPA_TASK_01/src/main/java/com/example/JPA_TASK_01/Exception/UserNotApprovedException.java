package com.example.JPA_TASK_01.Exception;

public class UserNotApprovedException extends RuntimeException {
    public UserNotApprovedException(String message) {
        super(message);
    }
}
