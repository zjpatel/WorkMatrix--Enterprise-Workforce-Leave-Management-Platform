import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 60px; text-align: center">
      <h1>
        <svg class="icon icon-lg" viewBox="0 0 24 24" style="margin-right: 8px; vertical-align: -0.2em;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
        Unauthorized
      </h1>
      <p>You do not have permission to access this page.</p>
      <a routerLink="/employees">Go back</a>
    </div>
  `
})
export class UnauthorizedComponent {}
