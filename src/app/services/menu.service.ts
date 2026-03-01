import { Injectable } from '@angular/core';
import { MenuItem, RouteLabel } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  // Aquí vive la única fuente de la verdad de tu menú
  private menuItems: MenuItem[] = [
    { ruta: '/home', icono: 'bi-house', nombre: 'Página Principal' },
    { ruta: '/orders', icono: 'bi-journal-check', nombre: 'Órdenes' },
    { ruta: '/repairs', icono: 'bi-wrench', nombre: 'Reparaciones' },
    { ruta: '/inventory', icono: 'bi-tags', nombre: 'Inventario' },
  ];

  private routeLabels: RouteLabel[] = [
    { ruta: '/orders/form-orders', nombre: 'Crear Orden' },
    { ruta: '/orders/edit-orders', nombre: 'Editar Orden' },
    { ruta: '/inventory/form-inventory', nombre: 'Crear Inventario' },
    { ruta: '/inventory/edit-inventory', nombre: 'Editar Inventario' },
  ];

  // Método para el Sidebar
  getMenu(): MenuItem[] {
    return this.menuItems;
  }

  // Método estrella para el Breadcrumb: busca el nombre bonito según la URL
  getMenuNameByUrl(url: string): string | null {
    // 1. Rutas etiquetadas: match exacto primero
    const exactLabel = this.routeLabels.find((r) => url === r.ruta);
    if (exactLabel) return exactLabel.nombre;

    // 2. Menú visible: match exacto
    const menuExact = this.menuItems.find((m) => url === m.ruta);
    if (menuExact) return menuExact.nombre;

    // 3. Rutas etiquetadas: match parcial (ej: /orders/form-orders/123)
    const partialLabel = this.routeLabels.find((r) =>
      url.startsWith(r.ruta + '/'),
    );
    if (partialLabel) return partialLabel.nombre;

    // 4. Menú visible: match parcial (ej: /orders/123)
    const menuPartial = this.menuItems.find((m) =>
      url.startsWith(m.ruta + '/'),
    );
    if (menuPartial) return menuPartial.nombre;

    return null;
  }

  //   private routeLabels: RouteLabel[] = [
  //     { ruta: '/orders/form-orders', nombre: 'Crear Orden' },
  //     { ruta: '/orders/edit-orders', nombre: 'Editar Orden' }, // Por si la necesitas después
  //     // Agrega más rutas hijas aquí...
  //   ];
}
