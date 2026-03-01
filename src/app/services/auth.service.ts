import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  LoginRequest,
  LoginResponse,
  RegisterUser,
} from '../models/login.model';
import { ApiHttpService } from './api-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiHttpService) {}
  private readonly tokenKey = 'auth_token';
  private readonly emailKey = 'auth_email';
  private readonly userKey = 'auth_user';
  private readonly endpointLogin = '/login';
  private readonly endpointRegister = '/register';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    if (!email || !password) {
      return throwError(
        () => new Error('Email y contraseña son obligatorios.'),
      );
    }

    const loginData: LoginRequest = { email, password };

    return this.api
      .post<LoginResponse, LoginRequest>(this.endpointLogin, loginData)
      .pipe(
        tap((loggingData) => {
          localStorage.setItem(this.tokenKey, loggingData.token);
          localStorage.setItem(this.emailKey, loggingData.user.email);
          localStorage.setItem(this.userKey, JSON.stringify(loggingData.user));
        }),
      );
  }

  register(
    name: string,
    email: string,
    password: string,
  ): Observable<LoginResponse> {
    if (!name || !email || !password) {
      return throwError(
        () => new Error('Nombre, email y contraseña son obligatorios.'),
      );
    }

    const registerData: RegisterUser = { name, email, password };

    return this.api
      .post<LoginResponse, RegisterUser>(this.endpointRegister, registerData)
      .pipe(
        tap((loggingData) => {
          localStorage.setItem(this.tokenKey, loggingData.token);
          localStorage.setItem(this.emailKey, loggingData.user.email);
          localStorage.setItem(this.userKey, JSON.stringify(loggingData.user));
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    localStorage.removeItem(this.userKey);
  }
}
