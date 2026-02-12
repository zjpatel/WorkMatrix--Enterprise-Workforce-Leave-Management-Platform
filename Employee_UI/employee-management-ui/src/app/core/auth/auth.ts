import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private BASE_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, data);
  }

  register(formData: FormData) {
    return this.http.post(`${this.BASE_URL}/register`, formData);
  }

  // 🔐 STORAGE
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  saveRole(role: string) {
    localStorage.setItem('role', role);
  }

  saveUserEmail(email: string) {
    localStorage.setItem('userEmail', email);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.clear();
  }
}
