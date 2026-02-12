import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    public auth: AuthApiService,
    private router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
