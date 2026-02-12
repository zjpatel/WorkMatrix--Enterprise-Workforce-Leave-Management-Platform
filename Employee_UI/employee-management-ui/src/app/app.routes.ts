import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [

  // 🔓 PUBLIC ROUTES
  {
    path: '',
    loadComponent: () =>
      import('./landing.component')
        .then(m => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login')
        .then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register')
        .then(m => m.RegisterComponent),
  },

  // 🔐 PROTECTED ROUTES
  {
    path: 'employees',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./employee/employee.routes')
        .then(m => m.EMPLOYEE_ROUTES),
  },

  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES),
  },

  // 🏖️ LEAVE MANAGEMENT
  {
    path: 'leave',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./leave/leave.routes')
        .then(m => m.LEAVE_ROUTES),
  },

  // ❌ UNAUTHORIZED
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized.component')
        .then(m => m.UnauthorizedComponent),
  },

  // 🚫 FALLBACK
  {
    path: '**',
    redirectTo: '',
  }
];
