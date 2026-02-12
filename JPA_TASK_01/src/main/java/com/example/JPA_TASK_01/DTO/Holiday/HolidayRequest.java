package com.example.JPA_TASK_01.DTO.Holiday;

import java.time.LocalDate;

public class HolidayRequest {

    private String holidayName;
    private LocalDate holidayDate;
    private String holidayType; // NATIONAL, FESTIVAL, COMPANY
    private Boolean isOptional;
    private String description;


    // getters & setters
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

}
