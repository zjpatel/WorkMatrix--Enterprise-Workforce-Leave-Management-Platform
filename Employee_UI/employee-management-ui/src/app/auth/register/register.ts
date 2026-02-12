import { Component } from '@angular/core';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../core/services/auth-api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  form!: FormGroup;
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  age: number | null = null;
  gender = '';
  imageFile?: File;
  imagePreview: string | null = null;

  error = '';
  errorMessages: string[] = [];
  success = '';
  loading = false;
  passwordMismatch = false;

  constructor(
    private authApi: AuthApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      age: [null, [Validators.required, Validators.min(18), Validators.max(120)]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.imageFile = input.files[0];

    const reader = new FileReader();
    reader.onload = e => {
      this.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.imageFile);
  }

  register(): void {
    this.clearErrors();
    this.success = '';
    this.passwordMismatch = false;

    if (this.form.invalid) {
      this.setFormError('Please fill in all required fields');
      return;
    }

    const { name, email, age, gender, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.passwordMismatch = true;
      this.setFormError('Passwords do not match');
      return;
    }

    if ((password ?? '').length < 6) {
      this.setFormError('Password must be at least 6 characters');
      return;
    }

    this.loading = true;

    // ===============================
    // FORM DATA
    // ===============================
    const formData = new FormData();

    const payload = {
      name: name!,
      email: email!,
      password: password!,
      age: age!,
      gender: gender!
    };

    // backend expects "data"
    formData.append(
      'data',
      new Blob([JSON.stringify(payload)], { type: 'application/json' })
    );

    // Add image if selected
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    // ===============================
    // REGISTER USER
    // ===============================
    this.authApi.register(formData).subscribe({

      next: (res: any) => {
        this.loading = false;
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },

      error: err => {
        this.loading = false;
        this.setBackendError(err, 'Registration failed');
      }
    });
  }

  private finishRegistration(): void {
    this.loading = false;
    this.success = 'Registration successful! Redirecting to login...';

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
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
