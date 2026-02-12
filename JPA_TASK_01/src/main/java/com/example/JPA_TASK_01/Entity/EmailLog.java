package com.example.JPA_TASK_01.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_log")
public class EmailLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer emailId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "email_type")
    private String emailType;
    // e.g. USER_APPROVED, LEAVE_APPROVED

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();

    // getters & setters
    public Integer getEmailId() {
        return emailId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getEmailType() {
        return emailType;
    }

    public void setEmailType(String emailType) {
        this.emailType = emailType;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }
}
