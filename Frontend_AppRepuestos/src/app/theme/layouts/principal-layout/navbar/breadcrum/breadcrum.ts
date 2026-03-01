import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuService } from '../../../../../services/menu.service';

interface BreadcrumbItem {
  label: string;
  url: string;
  isActive: boolean;
}

@Component({
  selector: 'app-breadcrum',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrum.html',
  styleUrl: './breadcrum.scss',
  standalone: true,
})
export class Breadcrum implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private menuService: MenuService,
  ) {}

  ngOnInit() {
    // Generate breadcrumbs on init
    this.generateBreadcrumbs(this.router.url);

    // Regenerate on every route change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.generateBreadcrumbs(event.url);
      });
  }

  private generateBreadcrumbs(url: string) {
    const parts = url.split('/').filter((p) => p);

    // 1. Buscamos cómo se llama "/home" en nuestro servicio (Página Principal)
    const homeLabel = this.menuService.getMenuNameByUrl('/home') || 'Home';

    const crumbs: BreadcrumbItem[] = [
      {
        label: homeLabel,
        url: '/home',
        isActive: parts.length === 1 && parts[0].toLowerCase() === 'home',
      },
    ];

    let accumulatedUrl = '';

    parts.forEach((part, index) => {
      accumulatedUrl += '/' + part;

      if (index === 0 && part.toLowerCase() === 'home') {
        return;
      }

      const isLast = index === parts.length - 1;

      // 2. Buscamos el nombre oficial en el menú. Si es una ruta que no está
      // en el menú lateral (ej. /ordenes/detalle), formateamos el string manualmente.
      const dynamicFormLabel = this.getDynamicFormLabel(accumulatedUrl, isLast);
      const menuName =
        dynamicFormLabel || this.menuService.getMenuNameByUrl(accumulatedUrl);
      const label = menuName
        ? menuName
        : decodeURIComponent(part)
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());

      crumbs.push({
        label,
        url: accumulatedUrl,
        isActive: isLast,
      });
    });

    this.breadcrumbs = crumbs;
  }

  private getDynamicFormLabel(url: string, isLast: boolean): string | null {
    if (!isLast) {
      return null;
    }

    const state = history.state || {};
    const mode = String(state.mode || '').toLowerCase();

    if (url === '/orders/form-orders') {
      const isEdit = mode === 'edit' || !!state.orderEdit;
      return isEdit ? 'Editar Orden' : 'Crear Orden';
    }

    if (url === '/inventory/form-inventory') {
      const isEdit = mode === 'edit' || !!state.inventarioEditar;
      return isEdit ? 'Editar Inventario' : 'Crear Inventario';
    }

    return null;
  }
}
