import { Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role-guard';

export const ADMIN_ROUTES: Routes = [

  {
    path: '',
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [

      {
        path: '',
        loadComponent: () =>
          import('./pages/admin-home/admin-home.component')
            .then(m => m.AdminHomeComponent)
      },

      {
        path: 'departments',
        loadComponent: () =>
          import('./pages/department-list/department-list.component')
            .then(m => m.DepartmentListComponent)
      },

      {
        path: 'holidays',
        loadComponent: () =>
          import('./pages/admin-holidays/admin-holidays.component')
            .then(m => m.AdminHolidaysComponent)
      }

    ]
  }

];
