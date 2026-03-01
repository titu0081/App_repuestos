import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../../../services/menu.service';
import { MenuItem } from '../../../../models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  constructor(private menuService: MenuService) {}
  //Enviar el fin de la sesión al componente padre
  @Output() logout = new EventEmitter<void>();
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems = this.menuService.getMenu();
  }

  // Estados del menú
  isPinned = false; // Se activa al hacer clic en la hamburguesa
  isHovered = false; // Se activa al pasar el mouse

  // El menú está expandido si está pineado O si tiene el mouse encima
  get isExpanded(): boolean {
    return this.isPinned || this.isHovered;
  }

  // Métodos para cambiar los estados
  togglePin(): void {
    this.isHovered = false;
    this.isPinned = !this.isPinned;
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  onLogout(): void {
    this.logout.emit();
  }
}
