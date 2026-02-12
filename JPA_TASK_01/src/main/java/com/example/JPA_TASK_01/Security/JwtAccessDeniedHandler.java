package com.example.JPA_TASK_01.Security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("status", 403);
        body.put("error", "Forbidden");
        body.put("message", "You do not have permission to access this resource");
        body.put("timestamp", LocalDateTime.now());

        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }
}
