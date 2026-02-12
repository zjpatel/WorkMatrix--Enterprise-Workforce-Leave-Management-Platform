import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from './core/services/auth-api';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements OnInit {
  // Animated CTA counters
  uptime = 0;
  employeesManaged = 0;
  supportHours = 0;

  private readonly targetUptime = 99.9;
  private readonly targetEmployeesManaged = 1000;
  private readonly targetSupportHours = 24;

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}

  ngOnInit() {
    // If already logged in, redirect to employees
    if (this.authApi.isLoggedIn()) {
      this.router.navigate(['/employees']);
    }

    // Animate CTA counters
    this.animateCounters();
  }

  private animateCounters() {
    const duration = 1500; // ms
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);

      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      this.uptime = +((this.targetUptime * ease)).toFixed(1);
      this.employeesManaged = Math.floor(this.targetEmployeesManaged * ease);
      this.supportHours = Math.floor(this.targetSupportHours * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure final values
        this.uptime = this.targetUptime;
        this.employeesManaged = this.targetEmployeesManaged;
        this.supportHours = this.targetSupportHours;
      }
    };
    requestAnimationFrame(step);
  }
}
