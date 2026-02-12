import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveService } from '../../../services/leave.service';
import { LeaveResponse } from '../../../models/leave-response.model';

@Component({
  selector: 'app-edit-leave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-leave.component.html',
  styleUrls: ['./edit-leave.component.css']
})
export class EditLeaveComponent implements OnInit {
  editLeaveForm!: FormGroup;
  leaveId!: number;
  currentLeave?: LeaveResponse;
  loading = false;
  loadingData = false;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.leaveId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadLeaveData();
  }

  initForm(): void {
    this.editLeaveForm = this.fb.group({
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

  loadLeaveData(): void {
    this.loadingData = true;
    this.errorMessage = '';

    this.leaveService.getMyLeaves().subscribe({
      next: (leaves) => {
        this.currentLeave = leaves.find(l => l.leaveId === this.leaveId);
        
        if (!this.currentLeave) {
          this.errorMessage = 'Leave not found';
          this.loadingData = false;
          return;
        }

        if (this.currentLeave.status !== 'PENDING') {
          this.errorMessage = 'Only pending leaves can be edited';
          this.loadingData = false;
          return;
        }

        this.editLeaveForm.patchValue({
          leaveType: this.currentLeave.leaveType,
          startDate: this.currentLeave.startDate,
          endDate: this.currentLeave.endDate,
          reason: this.currentLeave.reason
        });

        this.loadingData = false;
      },
      error: (err) => {
        this.loadingData = false;
        this.errorMessage = err.error?.message || 'Failed to load leave data';
      }
    });
  }

  onSubmit(): void {
    if (this.editLeaveForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    if (!this.currentLeave || this.currentLeave.status !== 'PENDING') {
      this.errorMessage = 'Only pending leaves can be edited';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.leaveService.editLeave(this.leaveId, this.editLeaveForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Leave updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/leave/my-leaves']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update leave. Please try again.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/leave/my-leaves']);
  }
}
