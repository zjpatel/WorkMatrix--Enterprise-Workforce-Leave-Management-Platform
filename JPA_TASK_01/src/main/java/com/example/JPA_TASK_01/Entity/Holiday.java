package com.example.JPA_TASK_01.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "holiday",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "holiday_date")
        }
)
public class Holiday {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer holidayId;

    @Column(nullable = false)
    private String holidayName;

    @Column(nullable = false)
    private LocalDate holidayDate;

    @Column(nullable = false)
    private String holidayType; // NATIONAL, FESTIVAL, COMPANY

    private Boolean isOptional = false;

    private String description;

    private LocalDateTime createdAt;
    public Integer getHolidayId() {
        return holidayId;
    }

    public void setHolidayId(Integer holidayId) {
        this.holidayId = holidayId;
    }

    public String getHolidayName() {
        return holidayName;
    }

    public void setHolidayName(String holidayName) {
        this.holidayName = holidayName;
    }

    public LocalDate getHolidayDate() {
        return holidayDate;
    }

    public void setHolidayDate(LocalDate holidayDate) {
        this.holidayDate = holidayDate;
    }

    public String getHolidayType() {
        return holidayType;
    }

    public void setHolidayType(String holidayType) {
        this.holidayType = holidayType;
    }

    public Boolean getOptional() {
        return isOptional;
    }

    public void setOptional(Boolean optional) {
        isOptional = optional;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


}
