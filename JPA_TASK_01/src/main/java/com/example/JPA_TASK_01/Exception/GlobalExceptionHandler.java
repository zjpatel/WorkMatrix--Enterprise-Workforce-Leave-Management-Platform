package com.example.JPA_TASK_01.Exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.access.AccessDeniedException;
@RestControllerAdvice
public class GlobalExceptionHandler {

  // ===============================
  // DUPLICATE EMAIL
  // ===============================
  @ExceptionHandler(DuplicateEmailException.class)
  public ResponseEntity<ApiError> handleDuplicateEmail(
          DuplicateEmailException ex) {

    ApiError error = new ApiError(
            HttpStatus.CONFLICT.value(),
            HttpStatus.CONFLICT.getReasonPhrase(),
            ex.getMessage()
    );

    return new ResponseEntity<>(error, HttpStatus.CONFLICT);
  }

  // ===============================
  // RESOURCE NOT FOUND
  // ===============================
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> handleIllegalArgument(
          IllegalArgumentException ex) {

    ApiError error = new ApiError(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            ex.getMessage()
    );

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }


  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex) {
    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(new ApiError(403,"Access Forbidden","This cannot be accessed !"));
  }


  // ===============================
  // FALLBACK (LAST RESORT)
  // ===============================
  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiError> handleGeneric(
          Exception ex) {

    ApiError error = new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "Something went wrong. Please contact support."
    );

    return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  // ===============================
// USER NOT APPROVED
// ===============================
  @ExceptionHandler(UserNotApprovedException.class)
  public ResponseEntity<ApiError> handleUserNotApproved(
          UserNotApprovedException ex) {

    ApiError error = new ApiError(
            HttpStatus.FORBIDDEN.value(),
            HttpStatus.FORBIDDEN.getReasonPhrase(),
            ex.getMessage()
    );

    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
  }

  // ===============================
// USER REJECTED
// ===============================
  @ExceptionHandler(UserRejectedException.class)
  public ResponseEntity<ApiError> handleUserRejected(
          UserRejectedException ex) {

    ApiError error = new ApiError(
            HttpStatus.FORBIDDEN.value(),
            HttpStatus.FORBIDDEN.getReasonPhrase(),
            ex.getMessage()
    );

    return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
  }

  // ===============================
// ILLEGAL STATE (BUSINESS RULE VIOLATION)
// ===============================
  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ApiError> handleIllegalState(
          IllegalStateException ex) {

    ApiError error = new ApiError(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            ex.getMessage()
    );

    return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
  }

}
