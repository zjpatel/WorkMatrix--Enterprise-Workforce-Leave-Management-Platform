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
  selector: 'app-manage-holidays',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-holidays.component.html',
  styleUrls: ['./manage-holidays.component.css']
})
export class ManageHolidaysComponent implements OnInit {

  holidays: Holiday[] = [];
  loading = false;
  error = '';
  errorMessages: string[] = [];

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = -1;  // For card view filter (-1 = All Holidays, 0-11 = specific month)
  calendarMonth: number = new Date().getMonth();  // For calendar display (0-11)
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

  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  loadHolidays(): void {
    this.loading = true;
    this.error = '';
    this.errorMessages = [];

    this.holidayService.getHolidaysByYear(this.selectedYear).subscribe({
      next: (data) => {
        this.holidays = data ?? [];
        this.generateCalendar();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error loading initial holidays:', err);
        this.loading = false;
        this.setBackendError(err, 'Failed to load holidays');
        this.cdr.detectChanges();
      }
    });
  }

  generateCalendar(): void {
    // Use calendarMonth for calendar display
    const month = this.calendarMonth;
    
    const firstDay = new Date(this.selectedYear, month, 1);
    const lastDay = new Date(this.selectedYear, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    this.calendarDays = [];

    // Previous month days
    const prevMonthLastDay = new Date(this.selectedYear, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(this.selectedYear, month - 1, prevMonthLastDay - i);
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
      const date = new Date(this.selectedYear, month, i);
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
      const date = new Date(this.selectedYear, this.selectedMonth + 1, i);
      this.calendarDays.push({
        date,
        day: i,
        isCurrentMonth: false,
        isToday: false,
        holidays: this.getHolidaysForDate(date)
      });
    }
  }

  private getHolidaysForDate(date: Date): Holiday[] {
    return this.holidays.filter(h => {
      const holidayDate = new Date(h.holidayDate + 'T00:00:00');
      return holidayDate.toDateString() === date.toDateString();
    });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.cdr.detectChanges();
    this.loadHolidays();
  }

  onMonthChange(direction: 'prev' | 'next' | 'select'): void {
    if (direction === 'prev') {
      // Calendar navigation for previous month
      this.calendarMonth--;
      if (this.calendarMonth < 0) {
        this.calendarMonth = 11;
        this.selectedYear--;
      }
      this.generateCalendar();
    } else if (direction === 'next') {
      // Calendar navigation for next month
      this.calendarMonth++;
      if (this.calendarMonth > 11) {
        this.calendarMonth = 0;
        this.selectedYear++;
      }
      this.generateCalendar();
    } else if (direction === 'select') {
      // Card view month filter - use local filtering for instant response
      this.error = '';
      this.errorMessages = [];
      this.cdr.detectChanges();
    }
    this.cdr.detectChanges();
  }

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

  // Get filtered holidays for card view based on selected month
  get filteredHolidays(): Holiday[] {
    if (this.selectedMonth === -1) {
      // Show all holidays for the year
      return this.holidays;
    } else {
      // Filter holidays for the selected month (0-based)
      return this.holidays.filter(h => {
        const holidayDate = new Date(h.holidayDate + 'T00:00:00');
        return holidayDate.getMonth() === this.selectedMonth && 
               holidayDate.getFullYear() === this.selectedYear;
      });
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
