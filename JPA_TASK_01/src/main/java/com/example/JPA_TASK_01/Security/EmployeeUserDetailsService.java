package com.example.JPA_TASK_01.Security;

import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Repo.UserRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public EmployeeUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // 1️⃣ Load USER by email (NOT employee)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found with email: " + email
                        )
                );

        // 2️⃣ Block login if not enabled (not approved)
        if (!user.isEnabled()) {
            throw new DisabledException(
                    "User account is not approved yet"
            );
        }

        // 3️⃣ Convert role → authority
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority("ROLE_" + user.getRole());

        // 4️⃣ Return Spring Security user
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),       // username
                user.getPassword(),    // hashed password
                List.of(authority)
        );
    }
}
