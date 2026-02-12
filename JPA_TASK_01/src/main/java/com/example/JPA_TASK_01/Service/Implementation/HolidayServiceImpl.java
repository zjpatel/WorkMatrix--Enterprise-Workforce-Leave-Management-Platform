package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.DTO.Holiday.HolidayRequest;
import com.example.JPA_TASK_01.DTO.Holiday.HolidayResponse;
import com.example.JPA_TASK_01.Entity.Holiday;
import com.example.JPA_TASK_01.Mapper.HolidayMapper;
import com.example.JPA_TASK_01.Repo.HolidayRepository;
import com.example.JPA_TASK_01.Service.HolidayService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class HolidayServiceImpl implements HolidayService {

    private final HolidayRepository holidayRepo;

    public HolidayServiceImpl(HolidayRepository holidayRepo) {
        this.holidayRepo = holidayRepo;
    }

    @Override
    public HolidayResponse createHoliday(HolidayRequest request) {

        if (holidayRepo.existsByHolidayDate(request.getHolidayDate())) {
            throw new RuntimeException("Holiday already exists on this date");
        }

        Holiday holiday = new Holiday();
        holiday.setHolidayName(request.getHolidayName());
        holiday.setHolidayDate(request.getHolidayDate());
        holiday.setHolidayType(request.getHolidayType());
        holiday.setOptional(
                request.getOptional() != null && request.getOptional()
        );
        holiday.setDescription(request.getDescription());

        holidayRepo.save(holiday);
        return mapToResponse(holiday);
    }

    @Override
    public HolidayResponse updateHoliday(Integer holidayId, HolidayRequest request) {

        Holiday holiday = holidayRepo.findById(holidayId)
                .orElseThrow(() -> new RuntimeException("Holiday not found"));

        holiday.setHolidayName(request.getHolidayName());
        holiday.setHolidayType(request.getHolidayType());
        holiday.setOptional(request.getOptional());
        holiday.setDescription(request.getDescription());

        return mapToResponse(holiday);
    }

    @Override
    public void deleteHoliday(Integer holidayId) {
        holidayRepo.deleteById(holidayId);
    }

    @Override
    public List<HolidayResponse> getHolidaysByYear(int year) {

        LocalDate start = LocalDate.of(year, 1, 1);
        LocalDate end = LocalDate.of(year, 12, 31);

        return holidayRepo.findByHolidayDateBetween(start, end)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private HolidayResponse mapToResponse(Holiday h) {
        HolidayResponse res = new HolidayResponse();
        res.setHolidayId(h.getHolidayId());
        res.setHolidayName(h.getHolidayName());
        res.setHolidayDate(h.getHolidayDate());
        res.setHolidayType(h.getHolidayType());
        res.setOptional(h.getOptional());
        res.setDescription(h.getDescription());
        return res;
    }


    public List<HolidayResponse> getHolidaysByYearAndMonth(int year, int month) {

        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Invalid month");
        }

        return holidayRepo.findByYearAndMonth(year, month)
                .stream()
                .map(HolidayMapper::toResponse)
                .toList();
    }
}
