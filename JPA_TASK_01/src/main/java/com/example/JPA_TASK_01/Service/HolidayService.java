package com.example.JPA_TASK_01.Service;

import com.example.JPA_TASK_01.DTO.Holiday.HolidayRequest;
import com.example.JPA_TASK_01.DTO.Holiday.HolidayResponse;

import java.util.List;

public interface HolidayService {

    HolidayResponse createHoliday(HolidayRequest request);

    HolidayResponse updateHoliday(Integer holidayId, HolidayRequest request);

    void deleteHoliday(Integer holidayId);

    List<HolidayResponse> getHolidaysByYear(int year);

    List<HolidayResponse> getHolidaysByYearAndMonth(int year, int month);
}
