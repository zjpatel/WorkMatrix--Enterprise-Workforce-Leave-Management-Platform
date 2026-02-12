package com.example.JPA_TASK_01.Filter;

import com.example.JPA_TASK_01.util.JWTutil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTutil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JWTutil jwtUtil,
            UserDetailsService userDetailsService) {

        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1️⃣ Read Authorization header
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        // 2️⃣ Extract token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        // 3️⃣ Validate token
        if (token != null && jwtUtil.validateToken(token)) {

            username = jwtUtil.extractUsername(token);

            // 4️⃣ Check SecurityContext (avoid re-auth)
            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                // 5️⃣ Load user details
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(username);

                // 6️⃣ Extract role from token
                String role = jwtUtil.extractRole(token);

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority("ROLE_" + role);

                // 7️⃣ Create authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                List.of(authority)
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                // 8️⃣ Set authentication in context
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        // 9️⃣ Continue filter chain
        filterChain.doFilter(request, response);
    }


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        // Skip JWT filter for auth endpoints
        return path.startsWith("/api/auth/");
    }

}
