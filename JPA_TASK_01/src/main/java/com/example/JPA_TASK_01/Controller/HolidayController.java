    package com.example.JPA_TASK_01.Controller;

    import com.example.JPA_TASK_01.DTO.Holiday.HolidayRequest;
    import com.example.JPA_TASK_01.Service.HolidayService;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/holidays")
    public class HolidayController {

        private final HolidayService holidayService;

        public HolidayController(HolidayService holidayService) {
            this.holidayService = holidayService;
        }

        // 🔐 ADMIN
        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping
        public ResponseEntity<?> create(@RequestBody HolidayRequest request) {
            return ResponseEntity.ok(holidayService.createHoliday(request));
        }

        @PreAuthorize("hasRole('ADMIN')")
        @PutMapping("/{id}")
        public ResponseEntity<?> update(
                @PathVariable Integer id,
                @RequestBody HolidayRequest request) {

            return ResponseEntity.ok(holidayService.updateHoliday(id, request));
        }

        @PreAuthorize("hasRole('ADMIN')")
        @DeleteMapping("/{id}")
        public ResponseEntity<?> delete(@PathVariable Integer id) {
            holidayService.deleteHoliday(id);
            return ResponseEntity.noContent().build();
        }

        // 👥 ADMIN + EMPLOYEE
        @GetMapping("/year/{year}")
        public ResponseEntity<?> getByYear(@PathVariable int year) {
            return ResponseEntity.ok(
                    holidayService.getHolidaysByYear(year)
            );
        }

        @GetMapping("/year/{year}/month/{month}")
        public ResponseEntity<?> getByYearAndMonth(
                @PathVariable int year,
                @PathVariable int month) {

            return ResponseEntity.ok(
                    holidayService.getHolidaysByYearAndMonth(year,month)
            );
        }

    }

