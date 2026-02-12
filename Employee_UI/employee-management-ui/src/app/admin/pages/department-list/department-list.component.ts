import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentApiService } from '../../../core/services/department-api.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {

  departments: any[] = [];
  loading = false;
  error = '';
  success = '';

  // Modal
  showCreateModal = false;
  newDeptName = '';
  createLoading = false;
  createError = '';

  // Deletion
  deleteConfirmId: number | null = null;

  constructor(
    private deptApi: DepartmentApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.error = '';

    this.deptApi.fetchAllDepartments().subscribe({
      next: (res: any) => {
        this.departments = res;
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 Force immediate UI update
      },
      error: () => {
        this.error = 'Failed to load departments';
        this.loading = false;
        this.cdr.detectChanges(); // 🔥 Force immediate UI update on error
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.newDeptName = '';
    this.createError = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newDeptName = '';
    this.createError = '';
  }

  createDepartment(): void {
    this.createError = '';

    if (!this.newDeptName.trim()) {
      this.createError = 'Department name is required';
      return;
    }

    this.createLoading = true;

    this.deptApi.createDepartment({ deptName: this.newDeptName }).subscribe({
      next: () => {
        this.createLoading = false;
        this.success = 'Department created successfully!';
        this.closeCreateModal();
        this.loadDepartments();
        this.cdr.detectChanges(); // 🔥 Force immediate UI update
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        this.createLoading = false;
        this.createError = err.error?.message || 'Failed to create department';
        this.cdr.detectChanges(); // 🔥 Force immediate UI update on error
      }
    });
  }

  deleteDepartment(deptId: number, deptName: string): void {
    if (!confirm(`Are you sure you want to delete "${deptName}"?`)) {
      return;
    }

    this.deleteConfirmId = deptId;
    this.deptApi.deleteDepartment(deptId).subscribe({
      next: () => {
        this.success = 'Department deleted successfully!';
        this.loadDepartments();
        this.deleteConfirmId = null;
        this.cdr.detectChanges(); // 🔥 Force immediate UI update
        setTimeout(() => {
          this.success = '';
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete department';
        this.deleteConfirmId = null;
        this.cdr.detectChanges(); // 🔥 Force immediate UI update on error
      }
    });
  }
}

