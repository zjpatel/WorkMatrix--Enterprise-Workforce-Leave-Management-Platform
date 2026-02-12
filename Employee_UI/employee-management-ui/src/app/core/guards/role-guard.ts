import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthApiService } from '../services/auth-api';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];

    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const userRole = this.authApi.getRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
