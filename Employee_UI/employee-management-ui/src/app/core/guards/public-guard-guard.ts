import { CanMatch, Router } from "@angular/router";
import { AuthService } from "../auth/auth";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanMatch {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canMatch(): boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/employees']);
      return false;
    }
    return true;
  }
}
