import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth-guard';

export const LEAVE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/leave-management/leave-management.component')
        .then(m => m.LeaveManagementComponent)
  }
];
