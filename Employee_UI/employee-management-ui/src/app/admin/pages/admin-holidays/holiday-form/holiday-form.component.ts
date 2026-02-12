import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from '../../../../core/services/holiday.service';
import { Holiday,CreateHolidayRequest } from '../../../../core/models/holiday.model';

@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './holiday-form.component.html',
  styleUrls: ['./holiday-form.component.css']
})
export class HolidayFormComponent implements OnInit {

  @Input() editingHolidayId: number | null = null;
  @Input() editingHoliday: Holiday | null = null;
  @Output() submit = new EventEmitter<Holiday>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  error = '';
  errorMessages: string[] = [];

  holidayTypes = ['NATIONAL', 'FESTIVAL', 'COMPANY'];

  constructor(
    private formBuilder: FormBuilder,
    private holidayService: HolidayService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    if (this.editingHolidayId && this.editingHoliday) {
      this.prefillForm(this.editingHoliday);
    }
  }

  // ============================
  // INITIALIZE FORM
  // ============================
  private initializeForm(): void {
    this.form = this.formBuilder.group({
      holidayName: ['', [Validators.required, Validators.minLength(2)]],
      holidayDate: ['', Validators.required],
      holidayType: ['NATIONAL', Validators.required],
      optional: [false],
      description: ['']
    });
  }

  // ============================
  // PREFILL FORM FOR EDIT
  // ============================
  private prefillForm(holiday: Holiday): void {
    this.form.patchValue({
      holidayName: holiday.holidayName || '',
      holidayDate: holiday.holidayDate || '',
      holidayType: holiday.holidayType || 'NATIONAL',
      optional: holiday.optional || false,
      description: holiday.description || ''
    });
    this.cdr.detectChanges();
  }

  // ============================
  // SUBMIT FORM
  // ============================
  onSubmit(): void {
    if (!this.form.valid) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.clearErrors();

    const payload = this.form.getRawValue();

    if (this.editingHolidayId) {
      this.updateHoliday(this.editingHolidayId, payload);
    } else {
      this.createHoliday(payload);
    }
  }

  // ============================
  // CREATE HOLIDAY
  // ============================
  private createHoliday(payload: CreateHolidayRequest): void {
    this.holidayService.createHoliday(payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.submit.emit(response);
      },
      error: (err) => {
        this.loading = false;
        this.setBackendError(err, 'Failed to create holiday');
        this.cdr.detectChanges();
      }
    });
  }

  // ============================
  // UPDATE HOLIDAY
  // ============================
  private updateHoliday(id: number, payload: CreateHolidayRequest): void {
    this.holidayService.updateHoliday(id, payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.submit.emit(response);
      },
      error: (err) => {
        this.loading = false;
        this.setBackendError(err, 'Failed to update holiday');
        this.cdr.detectChanges();
      }
    });
  }

  // ============================
  // CANCEL
  // ============================
  onCancel(): void {
    this.clearErrors();
    this.cancel.emit();
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

  // ============================
  // UI HELPERS
  // ============================
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getFormTitle(): string {
    return this.editingHolidayId ? 'Edit Holiday' : 'Add New Holiday';
  }

  getSubmitButtonText(): string {
    return this.loading
      ? (this.editingHolidayId ? '⏳ Updating...' : '⏳ Creating...')
      : (this.editingHolidayId ? '✏️ Update Holiday' : '✅ Create Holiday');
  }
}
