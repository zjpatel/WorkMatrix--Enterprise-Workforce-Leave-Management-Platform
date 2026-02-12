import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authApi.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
