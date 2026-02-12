import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth-guard';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent)
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/employee-create/employee-create.component')
        .then(m => m.EmployeeCreateComponent)
  },
  {
    path: 'edit/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/employee-create/employee-create.component')
        .then(m => m.EmployeeCreateComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/employee-profile/employee-profile.component')
        .then(m => m.EmployeeProfileComponent)
  },
  {
    path: 'holidays',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/employee-holidays/employee-holidays.component')
        .then(m => m.EmployeeHolidaysComponent)
  },
  {
    path: 'manage-holidays',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/manage-holidays/manage-holidays.component')
        .then(m => m.ManageHolidaysComponent)
  }
];
