import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LeaveService } from '../../services/leave.service';
import { LeaveResponse } from '../../models/leave-response.model';
import { ApplyLeaveRequest } from '../../models/apply-leave.model';
import { AuthApiService } from '../../../core/services/auth-api';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './leave-management.component.html',
  styleUrls: ['./leave-management.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveManagementComponent implements OnInit {
  // Form
  applyLeaveForm: FormGroup;
  leaveTypes = ['SICK', 'CASUAL', 'EARNED', 'OPTIONAL', 'UNPAID'];
  
  // Employee data
  myLeaves: LeaveResponse[] = [];
  loadingMyLeaves = false;
  
  // Admin data
  pendingLeaves: LeaveResponse[] = [];
  loadingPendingLeaves = false;
  
  // Edit functionality
  editingLeaveId: number | null = null;
  editLeaveForm: FormGroup;
  
  // UI state
  loading = false;
  submittingLeave = false;
  successMessage = '';
  errorMessage = '';
  isAdmin = false;
  currentYear: number = new Date().getFullYear();
  selectedYear: number = this.currentYear;
  
  // Confirmation modal
  showConfirmModal = false;
  confirmAction: 'approve' | 'reject' | 'revoke' | null = null;
  selectedLeave?: LeaveResponse;
  processingAction = false;

  // Edit modal
  showEditModal = false;

  // Delete modal
  showDeleteModal = false;
  selectedLeaveToDelete?: LeaveResponse;

  // Processed leaves (admin)
  loadingProcessedLeaves = false;
  processedStatusOptions: Array<'APPROVED' | 'REJECTED' | 'REVOKED'> = ['APPROVED', 'REJECTED', 'REVOKED'];
  processedStatusFilter: 'APPROVED' | 'REJECTED' | 'REVOKED' = 'APPROVED';
  processedYear: number = new Date().getFullYear();
  processedLeaveType?: string;
  processedFromDate?: string;
  processedToDate?: string;
  processedEmpId?: number;
  allProcessedLeaves: LeaveResponse[] = [];
  filteredProcessedLeaves: LeaveResponse[] = [];

  // Filters (reactive)
  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authApi: AuthApiService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize apply leave form
    this.applyLeaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: this.dateRangeValidator });

    // Initialize edit leave form
    this.editLeaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    }, { validators: this.dateRangeValidator });

    // Initialize filter form (employee)
    this.filterForm = this.fb.group({
      status: ['ALL'],
      leaveType: [undefined],
      year: [this.currentYear],
      fromDate: [undefined],
      toDate: [undefined]
    });
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadData();

    // Listen to filter changes with debounce and refresh stream
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      const values = this.filterForm.value;
      this.selectedYear = values.year || this.currentYear;
      // Trigger server refresh (near real-time)
      this.leaveService.refreshMyLeaves().subscribe();
      // Apply client-side filters to cached stream
      this.applyFilterFromForm();
      this.updateEmployeeSummary();
      this.cdr.markForCheck();
    });

    // Subscribe to stream for near real-time updates
    this.leaveService.getMyLeaves$().subscribe((list) => {
      this.myLeaves = list || [];
      this.applyFilterFromForm();
      this.updateEmployeeSummary();
      this.cdr.markForCheck();
    });
  }

  checkUserRole(): void {
    this.isAdmin = this.authApi.isAdmin();
  }

  loadData(): void {
    if (this.isAdmin) {
      this.loadPendingLeaves();
      this.loadProcessedLeaves();
    } else {
      // Initial fetch populates the stream
      this.leaveService.refreshMyLeaves().subscribe();
    }
  }

  refresh(): void {
    this.clearMessages();
    this.loadData();
  }

  // ========================================
  // Employee Methods
  // ========================================

  loadMyLeaves(): void {
    this.loadingMyLeaves = true;
    this.clearMessages();

    this.leaveService.getMyLeaves().subscribe({
      next: (data) => {
        this.myLeaves = data;
        this.loadingMyLeaves = false;
        this.applyFilterFromForm();
        this.updateEmployeeSummary();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loadingMyLeaves = false;
        this.errorMessage = err.error?.message || 'Failed to load your leaves';
        this.cdr.markForCheck();
      }
    });
  }

  // Employee filter state
  employeeStatusOptions: Array<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED'> = ['ALL','PENDING','APPROVED','REJECTED','REVOKED'];
  filteredMyLeaves: LeaveResponse[] = [];
  // Usage summary (employee)
  employeeUsageSummary: Array<{ type: string; used: number; allowed: number; remaining: number; percent: number }> = [];

  private applyFilterFromForm(): void {
    const { status, leaveType, year, fromDate, toDate } = this.filterForm.value;
    let list = [...this.myLeaves];
    if (status && status !== 'ALL') {
      list = list.filter(l => l.status === status);
    }
    if (leaveType) {
      list = list.filter(l => l.leaveType === leaveType);
    }
    if (year) {
      list = list.filter(l => l.year === year);
    }
    if (fromDate) {
      const from = new Date(fromDate);
      list = list.filter(l => new Date(l.startDate) >= from);
    }
    if (toDate) {
      const to = new Date(toDate);
      list = list.filter(l => new Date(l.endDate) <= to);
    }
    this.filteredMyLeaves = list;
  }

  private readonly EMPLOYEE_ALLOWANCES: Record<string, number> = {
    SICK: 8,
    CASUAL: 6,
    EARNED: 12,
    OPTIONAL: 3,
    UNPAID: 0
  };

  private computeEmployeeUsageSummary(year: number): Array<{ type: string; used: number; allowed: number; remaining: number; percent: number }>{
    const summary: Array<{ type: string; used: number; allowed: number; remaining: number; percent: number }> = [];
    const types = Object.keys(this.EMPLOYEE_ALLOWANCES);
    for (const t of types) {
      const allowed = this.EMPLOYEE_ALLOWANCES[t];
      const used = this.myLeaves
        .filter(l => l.status === 'APPROVED' && l.year === year && l.leaveType === t)
        .reduce((sum, l) => sum + (l.paidDays || 0), 0);
      const remaining = Math.max(0, allowed - used);
      const percent = allowed > 0 ? Math.min(100, Math.round((used / allowed) * 100)) : 0;
      summary.push({ type: t, used, allowed, remaining, percent });
    }
    return summary;
  }

  private updateEmployeeSummary(): void {
    const year = this.filterForm.get('year')?.value ?? this.currentYear;
    this.employeeUsageSummary = this.computeEmployeeUsageSummary(year);
  }

  onApplyLeave(): void {
    if (this.applyLeaveForm.invalid) {
      this.applyLeaveForm.markAllAsTouched();
      return;
    }

    this.submittingLeave = true;
    this.clearMessages();

    const leaveRequest: ApplyLeaveRequest = this.applyLeaveForm.value;

    this.leaveService.applyLeave(leaveRequest).subscribe({
      next: (response) => {
        this.submittingLeave = false;
        this.successMessage = 'Leave application submitted successfully!';
        this.applyLeaveForm.reset();
        // Stream refresh is triggered by service; no manual reload
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.submittingLeave = false;
        this.errorMessage = err.error?.message || 'Failed to submit leave application';
        this.cdr.markForCheck();
      }
    });
  }

  canEdit(leave: LeaveResponse): boolean {
    // Only PENDING requests can be edited
    return leave.status === 'PENDING';
  }

  canDelete(leave: LeaveResponse): boolean {
    // Only PENDING requests can be deleted
    return leave.status === 'PENDING';
  }

  startEdit(leave: LeaveResponse): void {
    this.editingLeaveId = leave.leaveId;
    this.editLeaveForm.patchValue({
      leaveType: leave.leaveType,
      startDate: this.formatDateForInput(leave.startDate),
      endDate: this.formatDateForInput(leave.endDate),
      reason: leave.reason
    });
  }

  cancelEdit(): void {
    this.editingLeaveId = null;
    this.editLeaveForm.reset();
  }

  saveEdit(leaveId: number): void {
    if (this.editLeaveForm.invalid) {
      this.editLeaveForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.clearMessages();

    const editRequest = this.editLeaveForm.value;

    this.leaveService.editLeave(leaveId, editRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Leave updated successfully!';
        this.editingLeaveId = null;
        this.editLeaveForm.reset();
        // Stream refresh is triggered by service; no manual reload
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update leave';
        this.cdr.markForCheck();
      }
    });
  }

  openDeleteModal(leave: LeaveResponse): void {
    if (!this.canDelete(leave)) return;
    this.selectedLeaveToDelete = leave;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedLeaveToDelete = undefined;
  }

  confirmDelete(): void {
    if (!this.selectedLeaveToDelete) return;
    this.loading = true;
    this.clearMessages();
    const leaveId = this.selectedLeaveToDelete.leaveId;
    this.leaveService.deleteLeave(leaveId).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Leave request deleted successfully!';
        this.closeDeleteModal();
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to delete leave request';
        this.closeDeleteModal();
        this.cdr.markForCheck();
      }
    });
  }

  // ========================================
  // Admin Methods
  // ========================================

  loadPendingLeaves(): void {
    this.loadingPendingLeaves = true;
    this.clearMessages();

    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => {
        this.pendingLeaves = data;
        this.loadingPendingLeaves = false;
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.loadingPendingLeaves = false;
        this.errorMessage = err.error?.message || 'Failed to load pending leaves';
        this.cdr.markForCheck();
      }
    });
  }

  loadProcessedLeaves(): void {
    this.loadingProcessedLeaves = true;
    this.clearMessages();

    // Use backend filter to fetch leaves by selected filters
    this.leaveService.searchLeaves({
      status: this.processedStatusFilter,
      year: this.processedYear,
      leaveType: this.processedLeaveType,
      fromDate: this.processedFromDate,
      toDate: this.processedToDate,
      empId: this.processedEmpId
    }).subscribe({
      next: (data) => {
        this.allProcessedLeaves = data;
        this.filteredProcessedLeaves = data;
        this.loadingProcessedLeaves = false;
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.loadingProcessedLeaves = false;
        this.errorMessage = err.error?.message || 'Failed to load processed leaves';
        this.cdr.markForCheck();
      }
    });
  }

  onProcessedFilterChange(): void {
    // Re-query server with new status
    this.loadProcessedLeaves();
  }

  private applyProcessedFilter(): void {
    // Not used when server-side filter is active, kept for potential multi-field client filtering.
    this.filteredProcessedLeaves = this.allProcessedLeaves.filter(l => l.status === this.processedStatusFilter);
  }

  openConfirmModal(leave: LeaveResponse, action: 'approve' | 'reject' | 'revoke'): void {
    this.selectedLeave = leave;
    this.selectedLeaveForAction = leave;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedLeave = undefined;
    this.confirmAction = null;
  }

  confirmActionExecute(): void {
    if (!this.selectedLeave || !this.confirmAction) {
      return;
    }

    this.processingAction = true;

    if (this.confirmAction === 'approve') {
      this.leaveService.approveLeave(this.selectedLeave.leaveId).subscribe({
        next: () => {
          this.processingAction = false;
          this.successMessage = `Leave request for ${this.selectedLeave?.employeeName} approved successfully!`;
          this.closeConfirmModal();
          this.loadPendingLeaves();
          this.loadProcessedLeaves();
          this.cdr.markForCheck();
        },
        error: (err: HttpErrorResponse) => {
          this.processingAction = false;
          this.errorMessage = err.error?.message || 'Failed to approve leave';
          this.closeConfirmModal();
          this.cdr.markForCheck();
        }
      });
    } else if (this.confirmAction === 'reject') {
      this.leaveService.rejectLeave(this.selectedLeave.leaveId).subscribe({
        next: () => {
          this.processingAction = false;
          this.successMessage = `Leave request for ${this.selectedLeave?.employeeName} rejected successfully!`;
          this.closeConfirmModal();
          this.loadPendingLeaves();
          this.loadProcessedLeaves();
          this.cdr.markForCheck();
        },
        error: (err: HttpErrorResponse) => {
          this.processingAction = false;
          this.errorMessage = err.error?.message || 'Failed to reject leave';
          this.closeConfirmModal();
          this.cdr.markForCheck();
        }
      });
    } else if (this.confirmAction === 'revoke') {
      this.leaveService.revokeLeave(this.selectedLeave.leaveId).subscribe({
        next: () => {
          this.processingAction = false;
          this.successMessage = `Leave for ${this.selectedLeave?.employeeName} revoked successfully!`;
          this.closeConfirmModal();
          this.loadPendingLeaves();
          this.loadProcessedLeaves();
          this.cdr.markForCheck();
        },
        error: (err: HttpErrorResponse) => {
          this.processingAction = false;
          this.errorMessage = err.error?.message || 'Failed to revoke leave';
          this.closeConfirmModal();
          this.cdr.markForCheck();
        }
      });
    }
  }

  // Alias to match template button
  confirmActionHandler(): void {
    this.confirmActionExecute();
  }

  // ========================================
  // Utility Methods
  // ========================================

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'REJECTED':
        return 'status-rejected';
      case 'PENDING':
        return 'status-pending';
      case 'REVOKED':
        return 'status-revoked';
      default:
        return 'status-pending';
    }
  }

  // Alias to match template binding
  getStatusClass(status: string): string {
    return this.getStatusBadgeClass(status);
  }

  // Employee edit modal handlers
  openEditModal(leave: LeaveResponse): void {
    if (!this.canEdit(leave)) return;
    this.startEdit(leave);
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.cancelEdit();
  }

  onUpdateLeave(): void {
    if (this.editingLeaveId != null) {
      this.saveEdit(this.editingLeaveId);
    }
  }

  // Revoke button availability: only approved and start date in the future
  canRevoke(leave: LeaveResponse): boolean {
    if (leave.status !== 'APPROVED') return false;
    const start = new Date(leave.startDate);
    const today = new Date();
    // Remove time portion for comparison
    start.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return start > today;
  }

  // For confirmation modal details
  selectedLeaveForAction?: LeaveResponse;

  // trackBy to reduce DOM updates
  trackByLeaveId(index: number, item: LeaveResponse): number {
    return item.leaveId;
  }

  // Date range validator
  private dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return { dateRangeInvalid: true };
    }

    return null;
  }
}
