import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../../services/leave.service';
import { LeaveResponse } from '../../../models/leave-response.model';

@Component({
  selector: 'app-leave-actions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-actions.component.html',
  styleUrls: ['./leave-actions.component.css']
})
export class LeaveActionsComponent implements OnInit {
  allLeaves: LeaveResponse[] = [];
  filteredLeaves: LeaveResponse[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  selectedLeave?: LeaveResponse;
  showConfirmModal = false;
  processingAction = false;

  selectedStatus: string = 'APPROVED';
  statusOptions = ['ALL', 'APPROVED', 'REJECTED', 'REVOKED'];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadAllLeaves();
  }

  loadAllLeaves(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.leaveService.getAllLeaves().subscribe({
      next: (data) => {
        this.allLeaves = data.filter(l => l.status !== 'PENDING');
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load leaves';
      }
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'ALL') {
      this.filteredLeaves = this.allLeaves;
    } else {
      this.filteredLeaves = this.allLeaves.filter(l => l.status === this.selectedStatus);
    }
  }

  onStatusFilterChange(): void {
    this.applyFilter();
  }

  canRevoke(leave: LeaveResponse): boolean {
    if (leave.status !== 'APPROVED') return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(leave.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    return startDate > today;
  }

  openRevokeModal(leave: LeaveResponse): void {
    if (!this.canRevoke(leave)) {
      this.errorMessage = 'Cannot revoke: Leave must be approved and start date must be in the future';
      return;
    }
    this.selectedLeave = leave;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.selectedLeave = undefined;
  }

  confirmRevoke(): void {
    if (!this.selectedLeave) return;

    this.processingAction = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.leaveService.revokeLeave(this.selectedLeave.leaveId).subscribe({
      next: (response) => {
        this.processingAction = false;
        this.successMessage = 'Leave revoked successfully!';
        this.closeConfirmModal();
        this.loadAllLeaves();
      },
      error: (err) => {
        this.processingAction = false;
        this.errorMessage = err.error?.message || 'Failed to revoke leave';
        this.closeConfirmModal();
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'APPROVED': 'status-approved',
      'REJECTED': 'status-rejected',
      'REVOKED': 'status-revoked'
    };
    return statusMap[status] || '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
