import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LeaveService } from '../../../services/leave.service';
import { LeaveResponse } from '../../../models/leave-response.model';

@Component({
  selector: 'app-my-leaves',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-leaves.component.html',
  styleUrls: ['./my-leaves.component.css']
})
export class MyLeavesComponent implements OnInit {
  leaves: LeaveResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyLeaves();
  }

  loadMyLeaves(): void {
    this.loading = true;
    this.errorMessage = '';

    this.leaveService.getMyLeaves().subscribe({
      next: (data) => {
        this.leaves = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to load leaves';
      }
    });
  }

  canEdit(leave: LeaveResponse): boolean {
    return leave.status === 'PENDING';
  }

  editLeave(leaveId: number): void {
    this.router.navigate(['/leave/edit', leaveId]);
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'status-pending',
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
