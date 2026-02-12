import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  token: string;
  role: string; // ADMIN | EMPLOYEE
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {

  private BASE_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // =====================
  // REGISTER (FIXED)
  // =====================
register(formData: FormData) {
  return this.http.post(
    'http://localhost:8080/api/auth/register',
    formData
  );
}


  // =====================
  // LOGIN
  // =====================
  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.BASE_URL}/login`, data);
  }

  // =====================
  // STORAGE
  // =====================
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  saveUserEmail(email: string): void {
    localStorage.setItem('userEmail', email);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isEmployee(): boolean {
    return this.getRole() === 'EMPLOYEE';
  }

  logout(): void {  
    localStorage.clear();
  }

uploadUserImages(userId: number, files: File[]) {
  const formData = new FormData();

  // 🔥 MUST be "images" (plural)
  files.forEach(file => formData.append('images', file));

  return this.http.post(
    `http://localhost:8080/api/images/upload/user/${userId}`,
    formData
  );
}


  getUserImages(userId: number) {
    return this.http.get<any>(
      `http://localhost:8080/api/images/upload/user/${userId}`
    );
  }

}
