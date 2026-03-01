import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Sidebar } from './sidebar/sidebar';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-principal-layout',
  standalone: true,
  imports: [Sidebar, Navbar, RouterModule],
  templateUrl: './principal-layout.html',
  styleUrl: './principal-layout.scss',
})
export class PrincipalLayout {
  // Uso de Paso de parámetros de padres a hijos: este objeto se envía al Navbar por @Input.
  currentUser = {
    name:
      JSON.parse(localStorage.getItem('auth_user') || '{}').name || 'Usuario',
    email: localStorage.getItem('auth_email') || '',
  };

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
