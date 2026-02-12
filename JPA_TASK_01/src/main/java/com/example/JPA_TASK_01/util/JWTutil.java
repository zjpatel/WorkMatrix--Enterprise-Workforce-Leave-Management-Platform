package com.example.JPA_TASK_01.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JWTutil {

  private final Key secretKey;

  // 1 hour validity
  private static final long JWT_EXPIRATION_MS = 1000 * 60 * 60;

  public JWTutil(@Value("${jwt.secret}") String secret) {
    this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
  }

  // ===============================
  // GENERATE TOKEN
  // ===============================
  public String generateToken(String username, String role) {

    return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(
                    new Date(System.currentTimeMillis() + JWT_EXPIRATION_MS)
            )
            .signWith(secretKey)
            .compact();
  }

  // ===============================
  // VALIDATE TOKEN
  // ===============================
  public boolean validateToken(String token) {

    try {
      Jwts.parserBuilder()
              .setSigningKey(secretKey)
              .build()
              .parseClaimsJws(token);

      return true;

    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  // ===============================
  // EXTRACT USERNAME
  // ===============================
  public String extractUsername(String token) {

    return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
  }

  // ===============================
  // EXTRACT ROLE
  // ===============================
  public String extractRole(String token) {

    return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .get("role", String.class);
  }
}
