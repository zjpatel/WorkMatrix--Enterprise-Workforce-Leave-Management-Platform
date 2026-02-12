package com.example.JPA_TASK_01.Exception;

public class UserRejectedException extends RuntimeException {
    public UserRejectedException(String message) {
        super(message);
    }
}
