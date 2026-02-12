import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../../../services/leave.service';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css']
})
export class ApplyLeaveComponent implements OnInit {
  applyLeaveForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  leaveTypes = [
    'SICK_LEAVE',
    'CASUAL_LEAVE',
    'EARNED_LEAVE',
    'MATERNITY_LEAVE',
    'PATERNITY_LEAVE',
    'UNPAID_LEAVE'
  ];

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.applyLeaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    }, {
      validators: this.dateRangeValidator
    });
  }

  dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    
    if (startDate && endDate && startDate > endDate) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.applyLeaveForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.leaveService.applyLeave(this.applyLeaveForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Leave application submitted successfully!';
        setTimeout(() => {
          this.router.navigate(['/leave/my-leaves']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to apply leave. Please try again.';
      }
    });
  }

  onReset(): void {
    this.applyLeaveForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
