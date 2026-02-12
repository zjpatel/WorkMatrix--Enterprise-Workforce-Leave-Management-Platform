import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api';
import { AuthStateService } from '../../core/auth/auth-state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error = '';
  errorMessages: string[] = [];
  loading = false;

  constructor(
    private authApi: AuthApiService,
    private authState: AuthStateService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Initialize reactive form during construction so it's ready at first render
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    if (reason === 'session-expired') {
      this.error = 'Session expired please login again';
    }

  }

  login() {
    if (this.form.invalid) {
      this.setFormError('Please enter email and password');
      return;
    }

    this.loading = true;
    this.clearErrors();

    const { email, password } = this.form.getRawValue();
    this.authApi.login({ email: email!, password: password! }).subscribe({
      next: res => {
        this.authApi.saveToken(res.token);
        this.authApi.saveRole(res.role);
        this.authApi.saveUserEmail(email!);
        this.authState.setLogin(email!);
        this.router.navigate(['/employees']);
      },
      error: err => {
        this.loading = false;
        this.setBackendError(err, 'Invalid credentials');
      }
    });
  }

  private setFormError(message: string): void {
    this.error = message;
    this.errorMessages = [message];
  }

  private setBackendError(err: any, fallback: string): void {
    const messages = this.extractErrorMessages(err, fallback);
    this.errorMessages = messages;
    this.error = messages[0] || fallback;
  }

  private clearErrors(): void {
    this.error = '';
    this.errorMessages = [];
  }

  private extractErrorMessages(err: any, fallback: string): string[] {
    if (!err) return [fallback];
    if (err.status === 0) {
      return ['Network error. Please check your connection and try again.'];
    }

    const payload = err.error;

    if (typeof payload === 'string' && payload.trim()) {
      return [payload];
    }

    if (payload?.message && typeof payload.message === 'string') {
      return [payload.message];
    }

    if (Array.isArray(payload?.errors)) {
      const msgs = payload.errors
        .map((e: any) => e?.message ?? e)
        .filter(Boolean)
        .map(String);
      if (msgs.length > 0) return msgs;
    }

    if (Array.isArray(payload?.messages)) {
      const msgs = payload.messages.filter(Boolean).map(String);
      if (msgs.length > 0) return msgs;
    }

    return [fallback];
  }
}

