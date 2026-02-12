import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HolidayService } from '../../../core/services/holiday.service';
import { Holiday } from '../../../core/models/holiday.model';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  holidays: Holiday[];
}

@Component({
  selector: 'app-employee-holidays',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-holidays.component.html',
  styleUrls: ['./employee-holidays.component.css']
})
export class EmployeeHolidaysComponent implements OnInit {

  holidays: Holiday[] = [];
  loading = false;
  error = '';
  errorMessages: string[] = [];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = -1;
  years: number[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  viewMode: 'calendar' | 'cards' = 'calendar';
  calendarDays: CalendarDay[] = [];
  hoveredHoliday: Holiday | null = null;

  constructor(
    private holidayService: HolidayService,
    public cdr: ChangeDetectorRef
  ) {
    this.initializeYears();
  }

  ngOnInit(): void {
    this.loadHolidays();
  }

  // ============================
  // INITIALIZE YEARS
  // ============================
  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  // ============================
  // LOAD HOLIDAYS
  // ============================
  loadHolidays(): void {
    this.loading = true;
    this.error = '';
    this.errorMessages = [];

    this.holidayService.getHolidaysByYear(this.selectedYear).subscribe({
      next: (data) => {
        console.log('Holidays API Response:', data);
        this.holidays = data ?? [];
        this.generateCalendar();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.setBackendError(err, 'Failed to load holidays');
        this.cdr.detectChanges();
      }
    });
  }

  // ============================
  // GENERATE CALENDAR
  // ============================
  generateCalendar(): void {
    const firstDay = new Date(this.selectedYear, this.selectedMonth, 1);
    const lastDay = new Date(this.selectedYear, this.selectedMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Add previous month's days
    const prevLastDay = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(this.selectedYear, this.selectedMonth - 1, prevLastDay - i);
      this.calendarDays.push({
        date: prevDate,
        day: prevDate.getDate(),
        isCurrentMonth: false,
        isToday: this.isToday(prevDate),
        holidays: this.getHolidaysForDate(prevDate)
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.selectedYear, this.selectedMonth, i);
      this.calendarDays.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        holidays: this.getHolidaysForDate(date)
      });
    }

    // Add next month's days
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(this.selectedYear, this.selectedMonth + 1, i);
      this.calendarDays.push({
        date: nextDate,
        day: i,
        isCurrentMonth: false,
        isToday: this.isToday(nextDate),
        holidays: this.getHolidaysForDate(nextDate)
      });
    }
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private getHolidaysForDate(date: Date): Holiday[] {
    return this.holidays.filter(h => {
      const holidayDate = new Date(h.holidayDate + 'T00:00:00');
      return holidayDate.toDateString() === date.toDateString();
    });
  }

  // ============================
  // MONTH NAVIGATION
  // ============================
  onMonthChange(direction: 'prev' | 'next' | 'select'): void {
    if (direction === 'prev') {
      this.selectedMonth--;
      if (this.selectedMonth < 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      }
      this.generateCalendar();
    } else if (direction === 'next') {
      this.selectedMonth++;
      if (this.selectedMonth > 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      }
      this.generateCalendar();
    } else if (direction === 'select') {
      // Load holidays from backend
      this.loading = true;
      this.error = '';
      this.errorMessages = [];
      
      if (this.selectedMonth === -1) {
        // Load all holidays for the year
        this.holidayService.getHolidaysByYear(this.selectedYear).subscribe({
          next: (data) => {
            this.holidays = data ?? [];
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.loading = false;
            this.setBackendError(err, 'Failed to load holidays');
            this.cdr.detectChanges();
          }
        });
      } else {
        // Load holidays for selected month
        // Convert 0-based month (JS) to 1-based month (backend API)
        const backendMonth = this.selectedMonth + 1;
        this.holidayService.getHolidaysByMonth(this.selectedYear, backendMonth).subscribe({
          next: (data) => {
            this.holidays = data ?? [];
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.loading = false;
            this.setBackendError(err, 'Failed to load holidays for month');
            this.cdr.detectChanges();
          }
        });
      }
    }
    this.cdr.detectChanges();
  }

  // ============================
  // YEAR FILTER
  // ============================
  onYearChange(year: number): void {
    this.selectedYear = year;
    this.selectedMonth = new Date().getMonth();
    this.cdr.detectChanges();
    this.generateCalendar();
  }

  // ============================
  // UI HELPERS
  // ============================
  getTypeColor(type: string): string {
    switch (type) {
      case 'NATIONAL': return '#ef4444';
      case 'FESTIVAL': return '#f59e0b';
      case 'COMPANY': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  getTypeBadge(type: string): string {
    switch (type) {
      case 'NATIONAL': return '🇮🇳 National';
      case 'FESTIVAL': return 'Festival';
      case 'COMPANY': return 'Company';
      default: return type;
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  getDayOfWeek(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return '';
    }
  }

  getOptionalBadge(optional: boolean): string {
    return optional ? 'Optional' : 'Mandatory';
  }

  // ============================
  // ERROR HANDLING
  // ============================
  private setBackendError(err: any, fallback: string): void {
    const messages = this.extractErrorMessages(err, fallback);
    this.errorMessages = messages;
    this.error = messages[0] || fallback;
  }

  private extractErrorMessages(err: any, fallback: string): string[] {
    if (!err) return [fallback];
    if (err.status === 0) {
      return ['Network error. Please check your connection.'];
    }

    const payload = err.error;

    if (typeof payload === 'string' && payload.trim()) {
      return [payload];
    }

    if (payload?.message && typeof payload.message === 'string') {
      return [payload.message];
    }

    if (Array.isArray(payload?.errors)) {
      const msgs = payload.errors
        .map((e: any) => e?.message ?? e)
        .filter(Boolean)
        .map(String);
      if (msgs.length > 0) return msgs;
    }

    if (Array.isArray(payload?.messages)) {
      const msgs = payload.messages.filter(Boolean).map(String);
      if (msgs.length > 0) return msgs;
    }

    return [fallback];
  }

  trackByHolidayId(index: number, holiday: Holiday): any {
    return holiday.id || holiday.holidayId || index;
  }


  trackByDay(index: number, day: CalendarDay): any {
    return day.date.toISOString();
  }
}

