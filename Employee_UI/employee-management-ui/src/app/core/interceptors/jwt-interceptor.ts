import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth-api';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthApiService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();

    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          token &&
          error.status === 401 &&
          !this.isAuthRequest(req.url)
        ) {
          this.auth.logout();
          this.router.navigate(['/login'], {
            queryParams: { reason: 'session-expired' },
            replaceUrl: true
          });
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthRequest(url: string): boolean {
    return url.includes('/api/auth/login') || url.includes('/api/auth/register');
  }
}
