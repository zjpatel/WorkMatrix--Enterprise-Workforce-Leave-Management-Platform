import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { EmployeeApiService } from '../../../core/services/employee-api';
import { AuthApiService } from '../../../core/services/auth-api';
import { EmployeeViewModalComponent } from './employee-view-modal/employee-view-modal.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EmployeeViewModalComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  Math = Math; // For template access
  
  employees: any[] = [];
  private allEmployees: any[] = [];
  loading = false;
  error = '';

  searchTerm = '';

  statusFilter: 'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED' = 'ALL';
  statusOptions = ['ALL', 'APPROVED', 'PENDING', 'REJECTED'];

  selectedEmployee: any = null;
  showViewModal = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  pageSizeOptions = [5, 10, 20, 50];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private empApi: EmployeeApiService,
    public authApi: AuthApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(term => {
        this.searchTerm = term;
        this.loadEmployees();
      });
    this.loadEmployees();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==========================
  // LOAD EMPLOYEES
  // ==========================
  loadEmployees(): void {
    this.loading = true;
    this.error = '';

    // 🔥 ADMIN → ALL USERS
    if (this.authApi.isAdmin()) {
      if (this.allEmployees.length > 0) {
        this.applyAdminFilters();
        return;
      }

      this.empApi.getAllUsersForAdmin().subscribe({
        next: res => {
          this.allEmployees = res ?? [];
          this.applyAdminFilters();
        },
        error: () => {
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
      return;
    }

    // 🔹 EMPLOYEE → only approved employees
    this.empApi.fetchEmployees(this.currentPage, this.pageSize, this.searchTerm).subscribe({
      next: res => {
        this.employees = res.content || [];
        this.totalPages = res.totalPages || 0;
        this.totalElements = res.totalElements || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load employees';
        this.loading = false;
      }
    });
  }

  // ==========================
  // FILTERS
  // ==========================
  onSearch(term: string): void {
    if (this.authApi.isAdmin()) {
      this.searchTerm = term;
      this.currentPage = 0; // Reset to first page
      this.applyAdminFilters();
      return;
    }
    this.searchSubject.next(term);
  }

  onStatusFilterChange(status: string): void {
    this.statusFilter = status as any;
    this.currentPage = 0; // Reset to first page
    if (this.authApi.isAdmin()) {
      this.applyAdminFilters();
      return;
    }
    this.loadEmployees();
  }

  // ==========================
  // ACTIONS
  // ==========================
  viewEmployee(emp: any): void {
    // APPROVED → full employee
    if (emp.empId) {
      this.empApi.getEmployeeById(emp.empId).subscribe({
        next: full => {
          this.selectedEmployee = full;
          this.showViewModal = true;
        },
        error: () => {
          this.error = 'Failed to load employee details';
        }
      });
      return;
    }

    // PENDING / REJECTED / ADMIN
    this.selectedEmployee = emp;
    this.showViewModal = true;
  }

   editEmployee(id: number | any): void {
  console.log('Edit employee called with:', id);
  
  // Handle if full object is passed instead of just ID
  const userId = typeof id === 'number' ? id : (id?.userId || id);
  
  console.log('Resolved userId:', userId);
  
  if (this.authApi.isAdmin() && userId) {
    // Admin edits by userId
    console.log('Navigating to:', ['/employees/edit', userId]);
    this.closeViewModal();
    setTimeout(() => {
      this.router.navigate(['/employees/edit', userId]);
    }, 100);
  } else {
    // Employee edits their own profile
    this.closeViewModal();
    setTimeout(() => {
      this.router.navigate(['/employees/profile']);
    }, 100);
  }
}


    

  deleteEmployee(emp: any): void {
    if (!emp.empId) {
      this.error = 'Cannot delete user before approval';
      return;
    }

    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.empApi.deleteEmployee(emp.empId).subscribe({
      next: () => {
        if (this.authApi.isAdmin()) {
          this.allEmployees = this.allEmployees.filter(e => e.empId !== emp.empId);
          this.applyAdminFilters();
          return;
        }
        this.loadEmployees();
      },
      error: () => this.error = 'Failed to delete employee'
    });
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedEmployee = null;
  }

  createEmployee(): void {
    this.router.navigate(['/employees/create']);
  }

  // ==========================
  // UI HELPERS
  // ==========================
  getInitials(name: string): string {
    return name
      ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
      : '?';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'REJECTED': return '#ef4444';
      default: return '#6b7280';
    }
  }

  trackByEmployee(index: number, emp: any): any {
    return emp?.empId ?? emp?.userId ?? index;
  }

  // ==========================
  // PAGINATION
  // ==========================
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadEmployees();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadEmployees();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadEmployees();
    }
  }

  onPageSizeChange(): void {
    this.pageSize = Number(this.pageSize); // Convert string to number
    this.currentPage = 0;
    if (this.authApi.isAdmin()) {
      this.applyAdminFilters();
    } else {
      this.loadEmployees();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  private applyAdminFilters(): void {
    const search = this.searchTerm?.toLowerCase() ?? '';
    const filteredByStatus =
      this.statusFilter === 'ALL'
        ? this.allEmployees
        : this.allEmployees.filter(e => e.status === this.statusFilter);

    const filteredBySearch = search
      ? filteredByStatus.filter(e =>
          (e.name || '').toLowerCase().includes(search) ||
          (e.email || '').toLowerCase().includes(search)
        )
      : filteredByStatus;

    // Apply pagination
    this.totalElements = filteredBySearch.length;
    const pageSizeNum = Number(this.pageSize);
    this.totalPages = Math.ceil(this.totalElements / pageSizeNum);
    
    // Ensure currentPage doesn't exceed available pages
    if (this.currentPage >= this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages - 1;
    }
    
    const startIndex = this.currentPage * pageSizeNum;
    const endIndex = Math.min(startIndex + pageSizeNum, this.totalElements);
    this.employees = filteredBySearch.slice(startIndex, endIndex);

    console.log('🔍 PAGINATION DEBUG:', {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      totalElements: this.totalElements,
      totalPages: this.totalPages,
      startIndex,
      endIndex,
      slicedLength: this.employees.length,
      actualEmployees: this.employees.map(e => e.name || e.email)
    });

    this.loading = false;
    this.cdr.detectChanges();
  }
}
