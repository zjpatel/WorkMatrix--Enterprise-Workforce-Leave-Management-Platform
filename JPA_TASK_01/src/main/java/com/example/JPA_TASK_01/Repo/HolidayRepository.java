package com.example.JPA_TASK_01.Repo;

import com.example.JPA_TASK_01.Entity.Holiday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface HolidayRepository extends JpaRepository<Holiday, Integer> {

    List<Holiday> findByHolidayDateBetween(LocalDate start, LocalDate end);

    @Query("""
        SELECT h FROM Holiday h
        WHERE YEAR(h.holidayDate) = :year
          AND MONTH(h.holidayDate) = :month
        ORDER BY h.holidayDate
    """)
    List<Holiday> findByYearAndMonth(int year, int month);

    boolean existsByHolidayDate(LocalDate holidayDate);
}
