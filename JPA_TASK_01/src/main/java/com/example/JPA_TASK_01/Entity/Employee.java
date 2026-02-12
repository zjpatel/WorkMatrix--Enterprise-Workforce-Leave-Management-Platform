
package com.example.JPA_TASK_01.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emp_id")
    private Integer empId;

    // One user becomes exactly one employee after approval
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Many employees -> one department
    @ManyToOne
    @JoinColumn(name = "dept_id", nullable = false)
    private Department department;

    @Column(name = "joining_date")
    private LocalDate joiningDate = LocalDate.now();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Images> images = new ArrayList<>();

    // getters & setters
    public Integer getEmpId() {
        return empId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public List<Images> getImages() {
        return images;
    }
}
