import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeApiService } from '../../../core/services/employee-api';
import { DepartmentApiService } from '../../../core/services/department-api.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent implements OnInit {

  totalEmployees = 0;
  totalDepartments = 0;
  loading = true;
  error = '';

  constructor(
    private empApi: EmployeeApiService,
    private deptApi: DepartmentApiService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;

    // fetch employees count
    this.empApi.fetchEmployees(0, 1).subscribe({
      next: empRes => {
        this.totalEmployees = empRes.totalElements;

        // fetch departments count
        this.deptApi.fetchAllDepartments().subscribe({
          next: deptRes => {
            this.totalDepartments = deptRes.length;
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load departments';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to load employees';
        this.loading = false;
      }
    });
  }
}
