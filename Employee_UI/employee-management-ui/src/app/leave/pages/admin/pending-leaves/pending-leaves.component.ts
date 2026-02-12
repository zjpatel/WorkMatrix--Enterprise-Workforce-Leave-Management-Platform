import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveService } from '../../../services/leave.service';
import { LeaveResponse } from '../../../models/leave-response.model';

@Component({
  selector: 'app-pending-leaves',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-leaves.component.html',
  styleUrls: ['./pending-leaves.component.css']
})
export class PendingLeavesComponent implements OnInit {
  pendingLeaves: LeaveResponse[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  selectedLeave?: LeaveResponse;
  showConfirmModal = false;
  confirmAction: 'approve' | 'reject' | null = null;
  processingAction = false;

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadPendingLeaves();
  }

  loadPendingLeaves(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => {
        this.pendingLeaves = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load pending leaves';
      }
    });
  }

  openConfirmModal(leave: LeaveResponse, action: 'approve' | 'reject'): void {
    this.selectedLeave = leave;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedLeave = undefined;
    this.confirmAction = null;
  }

  confirmActionHandler(): void {
    if (!this.selectedLeave || !this.confirmAction) return;

    this.processingAction = true;
    this.errorMessage = '';
    this.successMessage = '';

    const action$ = this.confirmAction === 'approve'
      ? this.leaveService.approveLeave(this.selectedLeave.leaveId)
      : this.leaveService.rejectLeave(this.selectedLeave.leaveId);

    action$.subscribe({
      next: (response) => {
        this.processingAction = false;
        this.successMessage = `Leave ${this.confirmAction}d successfully!`;
        this.closeConfirmModal();
        this.loadPendingLeaves();
      },
      error: (err) => {
        this.processingAction = false;
        this.errorMessage = err.error?.message || `Failed to ${this.confirmAction} leave`;
        this.closeConfirmModal();
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
