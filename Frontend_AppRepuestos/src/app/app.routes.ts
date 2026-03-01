import { Routes } from '@angular/router';
import { PrincipalLayout } from './theme/layouts/principal-layout/principal-layout';
import { AuthLayout } from './theme/layouts/auth-layout/auth-layout';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register').then((m) => m.Register),
      },
    ],
  },
  {
    path: '',
    component: PrincipalLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./pages/orders/orders').then((m) => m.Orders),
      },

      {
        path: 'inventory',
        loadComponent: () =>
          import('./pages/inventory/inventory').then((m) => m.Inventory),
      },
      {
        path: 'repairs',
        loadComponent: () =>
          import('./pages/repairs/repairs').then((m) => m.Repairs),
      },

      {
        path: 'orders/form-orders',
        loadComponent: () =>
          import('./pages/orders/form_orders/form_orders').then(
            (m) => m.FormOrders,
          ),
      },
      {
        path: 'inventory/form-inventory',
        loadComponent: () =>
          import('./pages/inventory/form_inventory/form_inventory').then(
            (m) => m.FormInventory,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];
