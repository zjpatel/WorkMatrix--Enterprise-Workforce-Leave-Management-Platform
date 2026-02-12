package com.example.JPA_TASK_01.config;

import com.example.JPA_TASK_01.Filter.JwtAuthenticationFilter;
import com.example.JPA_TASK_01.Security.EmployeeUserDetailsService;
import com.example.JPA_TASK_01.Security.JwtAccessDeniedHandler;
import com.example.JPA_TASK_01.Security.JwtAuthEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity // enables @PreAuthorize later
public class SecurityConfig {

  private final JwtAuthEntryPoint jwtAuthEntryPoint;

  private final JwtAuthenticationFilter jwtAuthenticationFilter;
  private final EmployeeUserDetailsService userDetailsService;

  private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

  public SecurityConfig(
      JwtAuthenticationFilter jwtAuthenticationFilter,
      EmployeeUserDetailsService userDetailsService,
      JwtAuthEntryPoint jwtAuthEntryPoint,
      JwtAccessDeniedHandler jwtAccessDeniedHandler) {

    this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    this.userDetailsService = userDetailsService;
    this.jwtAuthEntryPoint = jwtAuthEntryPoint;
    this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
  }

  // ===============================
  // PASSWORD ENCODER
  // ===============================
  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  // ===============================
  // AUTHENTICATION MANAGER
  // ===============================
  @Bean
  public AuthenticationManager authenticationManager() {

    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());

    return new ProviderManager(authProvider);
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
  }

  // ===============================
  // SECURITY FILTER CHAIN
  // ===============================
  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http.cors(cors -> {})
        // disable csrf (JWT)
        .csrf(csrf -> csrf.disable())
        .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint))
        // stateless session
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(
            ex ->
                ex.authenticationEntryPoint(jwtAuthEntryPoint)
                    .accessDeniedHandler(jwtAccessDeniedHandler))
        .authorizeHttpRequests(
            auth ->
                auth

                    // 🔓 PUBLIC
                    .requestMatchers("/api/auth/**", "/api/images/**")
                    .permitAll()

                    // 🔐 ADMIN APIs
                    .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")

                    // 🔓 VIEW EMPLOYEES (ADMIN + EMPLOYEE)
                    .requestMatchers(HttpMethod.GET, "/api/employees")
                    .hasAnyRole("ADMIN", "EMPLOYEE")
                    .requestMatchers(HttpMethod.GET, "/api/employees/**")
                    .hasAnyRole("ADMIN", "EMPLOYEE")

                    // 🔐 EMPLOYEE: update own profile ONLY
                    .requestMatchers(HttpMethod.PUT, "/api/employees/me")
                    .hasRole("EMPLOYEE")

                    // 🔐 ADMIN: manage employees
                    .requestMatchers(HttpMethod.PUT, "/api/employees/**")
                    .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/employees/**")
                    .hasRole("ADMIN")

                    // 🔓 HOLIDAYS: visible to logged-in users
                    .requestMatchers(HttpMethod.GET, "/api/holidays/**")
                    .hasAnyRole("ADMIN", "EMPLOYEE")

                    // ===============================
                    // LEAVE MANAGEMENT
                    // ===============================

                    // EMPLOYEE leave actions
                    .requestMatchers("/api/leaves/my")
                    .hasRole("EMPLOYEE")
                    .requestMatchers(HttpMethod.POST, "/api/leaves")
                    .hasRole("EMPLOYEE")
                    .requestMatchers(HttpMethod.PUT, "/api/leaves/*")
                    .hasRole("EMPLOYEE")

                    // ADMIN leave actions
                    .requestMatchers("/api/leaves/pending")
                    .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/leaves/*/decision")
                    .hasRole("ADMIN")

                    // everything else
                    .anyRequest()
                    .authenticated())

        // add JWT filter
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
