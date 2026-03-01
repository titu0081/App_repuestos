import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerError = '';
  registerForm: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(7)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', [Validators.required]],
      documentId: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get city() {
    return this.registerForm.get('city');
  }

  get documentId() {
    return this.registerForm.get('documentId');
  }

  onSubmit(): void {
    this.registerError = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.registerForm.getRawValue();
    this.isSubmitting = true;

    this.authService
      .register(fullName ?? '', email ?? '', password ?? '')
      .subscribe({
        next: (response) => {
          Swal.fire({
            title: `¡Bienvenido, ${response.user.name}!`,
            text: 'Registro exitoso.',
            icon: 'success',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          }).then(() => {
            this.router.navigateByUrl('/home');
          });
        },
        error: (error: unknown) => {
          this.registerError = this.getRegisterErrorMessage(error);
          Swal.fire({
            title: 'No se pudo registrar',
            text: this.registerError,
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

  private getRegisterErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const nameErrors = error.error?.errors?.name;
      const emailErrors = error.error?.errors?.email;
      const passwordErrors = error.error?.errors?.password;

      if (Array.isArray(nameErrors) && nameErrors.length > 0) {
        return nameErrors[0];
      }

      if (Array.isArray(emailErrors) && emailErrors.length > 0) {
        return 'Este email ya esta registrado. Intenta con otro.';
      }

      if (Array.isArray(passwordErrors) && passwordErrors.length > 0) {
        return passwordErrors[0];
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

    return 'No se pudo registrar. Verifica tus datos.';
  }
}
