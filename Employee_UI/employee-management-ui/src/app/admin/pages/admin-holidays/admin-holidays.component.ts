import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HolidayService } from '../../../core/services/holiday.service';
import { AuthApiService } from '../../../core/services/auth-api';
import { Holiday } from '../../../core/models/holiday.model';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  holidays: Holiday[];
}

@Component({
  selector: 'app-admin-holidays',
  standalone: true,
  imports: [CommonModule, FormsModule, HolidayFormComponent],
  templateUrl: './admin-holidays.component.html',
  styleUrls: ['./admin-holidays.component.css']
})
export class AdminHolidaysComponent implements OnInit {

  holidays: Holiday[] = [];
  loading = false;
  error = '';
  errorMessages: string[] = [];
  success = '';

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = -1;  // For card view filter (-1 = All Holidays)
  calendarMonth: number = new Date().getMonth();  // For calendar display (0-11)
  years: number[] = [];
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  viewMode: 'calendar' | 'cards' = 'calendar';
  calendarDays: CalendarDay[] = [];

  showAddForm = false;
  editingHolidayId: number | null = null;
  editingHoliday: Holiday | null = null;
  hoveredHoliday: Holiday | null = null;

  constructor(
    private holidayService: HolidayService,
    public authApi: AuthApiService,
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
    const firstDay = new Date(this.selectedYear, this.calendarMonth, 1);
    const lastDay = new Date(this.selectedYear, this.calendarMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(this.selectedYear, this.calendarMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.selectedYear, this.calendarMonth - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        day: date.getDate(),
        isCurrentMonth: false,
        isToday: false,
        holidays: this.getHolidaysForDate(date)
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.selectedYear, this.calendarMonth, i);
      const isToday = date.toDateString() === today.toDateString();
      this.calendarDays.push({
        date,
        day: i,
        isCurrentMonth: true,
        isToday,
        holidays: this.getHolidaysForDate(date)
      });
    }

    // Next month days
    const remainingDays = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(this.selectedYear, this.calendarMonth + 1, i);
      this.calendarDays.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        holidays: this.getHolidaysForDate(date)
      });
    }
  }

  // ============================
  // GET HOLIDAYS FOR DATE
  // ============================
  private getHolidaysForDate(date: Date): Holiday[] {
    return this.holidays.filter(h => {
      const holidayDate = new Date(h.holidayDate + 'T00:00:00');
      return holidayDate.toDateString() === date.toDateString();
    });
  }

  // Get holidays for current month (for card view filtering)
  // ============================
  // YEAR & MONTH CHANGES
  // ============================
  onYearChange(year: number): void {
    this.selectedYear = year;
    this.cdr.detectChanges();
    this.loadHolidays();
  }

  onMonthChange(direction: 'prev' | 'next' | 'select'): void {
    if (direction === 'prev') {
      this.calendarMonth--;
      if (this.calendarMonth < 0) {
        this.calendarMonth = 11;
        this.selectedYear--;
      }
      this.generateCalendar();
    } else if (direction === 'next') {
      this.calendarMonth++;
      if (this.calendarMonth > 11) {
        this.calendarMonth = 0;
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
  // EDIT HOLIDAY
  // ============================
  editHoliday(holiday: Holiday): void {
    this.editingHolidayId = holiday.id || holiday.holidayId || null;
    this.editingHoliday = holiday;
    this.showAddForm = true;
    this.success = '';
    this.cdr.detectChanges();
  }

  // ============================
  // DELETE HOLIDAY
  // ============================
  deleteHoliday(holiday: Holiday): void {
    if (!confirm(`Are you sure you want to delete "${holiday.holidayName}"?`)) {
      return;
    }

    // Get ID from either field name
    const holidayId = holiday.id || holiday.holidayId;

    if (!holidayId) {
      this.error = 'Holiday ID is missing. Please reload the page.';
      return;
    }

    // Immediately remove from list and show success
    this.holidays = this.holidays.filter(h => (h.id || h.holidayId) !== holidayId);
    this.generateCalendar();
    this.success = 'Holiday deleted successfully';
    this.cdr.detectChanges();

    // Then confirm with API
    this.holidayService.deleteHoliday(holidayId).subscribe({
      next: () => {
        // Keep the UI updated
      },
      error: (err) => {
        this.success = '';
        this.setBackendError(err, 'Failed to delete holiday. Reloading...');
        this.cdr.detectChanges();
        // Reload on error to sync with server
        setTimeout(() => this.loadHolidays(), 1500);
      }
    });
  }

  // ============================
  // CLOSE FORM
  // ============================
  closeForm(): void {
    this.showAddForm = false;
    this.editingHolidayId = null;
    this.editingHoliday = null;
    this.clearErrors();
    this.cdr.detectChanges();
  }

  // ============================
  // ON FORM SUBMIT
  // ============================
  onFormSubmit(holiday: Holiday | null): void {
    if (!holiday) return;

    // Immediately close form and show loading
    this.showAddForm = false;
    this.editingHolidayId = null;
    this.editingHoliday = null;
    this.clearErrors();
    this.loading = true;
    this.holidays = [];
    this.success = 'Holiday updated successfully';
    this.cdr.detectChanges();
    
    // Then reload data
    setTimeout(() => this.loadHolidays(), 100);
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

  // ============================
  // ERROR HANDLING
  // ============================
  private setBackendError(err: any, fallback: string): void {
    const messages = this.extractErrorMessages(err, fallback);
    this.errorMessages = messages;
    this.error = messages[0] || fallback;
  }

  private clearErrors(): void {
    this.error = '';
    this.errorMessages = [];
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
