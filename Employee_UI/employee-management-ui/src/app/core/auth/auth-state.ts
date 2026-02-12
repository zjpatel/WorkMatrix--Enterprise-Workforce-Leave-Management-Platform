import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  private userEmail$ = new BehaviorSubject<string | null>(
    localStorage.getItem('userEmail')
  );

  isLoggedIn$ = this.loggedIn$.asObservable();
  userEmailStream$ = this.userEmail$.asObservable();

  setLogin(email: string) {
    this.loggedIn$.next(true);
    this.userEmail$.next(email);
  }

  logout() {
    this.loggedIn$.next(false);
    this.userEmail$.next(null);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
