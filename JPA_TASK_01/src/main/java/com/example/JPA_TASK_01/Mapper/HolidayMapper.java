package com.example.JPA_TASK_01.Mapper;

import com.example.JPA_TASK_01.DTO.Holiday.HolidayRequest;
import com.example.JPA_TASK_01.DTO.Holiday.HolidayResponse;
import com.example.JPA_TASK_01.Entity.Holiday;

public class HolidayMapper {

    private HolidayMapper() {
        // Utility class
    }

    // ===============================
    // ENTITY → RESPONSE
    // ===============================
    public static HolidayResponse toResponse(Holiday holiday) {

        HolidayResponse res = new HolidayResponse();
        res.setHolidayId(holiday.getHolidayId());
        res.setHolidayName(holiday.getHolidayName());
        res.setHolidayDate(holiday.getHolidayDate());
        res.setHolidayType(holiday.getHolidayType());
        res.setOptional(holiday.getOptional());
        res.setDescription(holiday.getDescription());

        return res;
    }

    // ===============================
    // REQUEST → ENTITY (CREATE)
    // ===============================
    public static Holiday toEntity(HolidayRequest req) {

        Holiday holiday = new Holiday();
        holiday.setHolidayName(req.getHolidayName());
        holiday.setHolidayDate(req.getHolidayDate());
        holiday.setHolidayType(req.getHolidayType());
        holiday.setOptional(req.getOptional());
        holiday.setDescription(req.getDescription());

        return holiday;
    }

    // ===============================
    // REQUEST → ENTITY (UPDATE)
    // ===============================
    public static void updateEntity(
            Holiday holiday,
            HolidayRequest req
    ) {

        if (req.getHolidayName() != null) {
            holiday.setHolidayName(req.getHolidayName());
        }

        if (req.getHolidayDate() != null) {
            holiday.setHolidayDate(req.getHolidayDate());
        }

        if (req.getHolidayType() != null) {
            holiday.setHolidayType(req.getHolidayType());
        }

        holiday.setOptional(req.getOptional());

        if (req.getDescription() != null) {
            holiday.setDescription(req.getDescription());
        }
    }
}
