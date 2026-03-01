import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginError = '';
  loginForm: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authService.login(email ?? '', password ?? '').subscribe({
      next: (response) => {
        Swal.fire({
          title: `¡Bienvenido, ${response.user.name}!`,
          text: 'Inicio de sesión exitoso.',
          icon: 'success',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        }).then(() => {
          this.router.navigateByUrl('/home');
        });
      },
      error: (error) => {
        this.loginError = this.getLoginErrorMessage(error);
        Swal.fire({
          title: 'No se pudo iniciar sesión',
          text: error.error.message,
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  private getLoginErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const emailErrors = error.error.errors.email;

      if (Array.isArray(emailErrors) && emailErrors.length > 0) {
        return 'No se pudo iniciar sesión. Verifica tus datos.';
      }

      if (typeof error.error?.message === 'string' && error.error.message) {
        return error.error.message;
      }

      if (error.status === 0) {
        return 'No hay conexión con el servidor.';
      }
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return 'No se pudo iniciar sesión. Verifica tus datos.';
  }
}
