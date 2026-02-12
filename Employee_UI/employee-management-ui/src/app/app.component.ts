import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthApiService } from './core/services/auth-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar *ngIf="auth.isLoggedIn()"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public auth: AuthApiService) {}
}
