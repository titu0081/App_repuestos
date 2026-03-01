import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '../../models/interfaces.models';
import { DevicesService } from '../../services/devices.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
declare const bootstrap: any;

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
  imports: [DatePipe],
})
export class Orders implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private devicesService: DevicesService,
  ) {}
  ordenes: Device[] = [];

  ngOnInit(): void {
    this.consultOrders();
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
  }

  ngOnDestroy(): void {
    this.clearTooltips();
  }

  consultOrders() {
    this.ordenes = [];
    this.devicesService.get().subscribe({
      next: (data) => {
        this.ordenes = data.data;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  clearTooltips() {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );

    tooltipTriggerList.forEach((el) => {
      const tooltip = bootstrap.Tooltip.getInstance(el);
      if (tooltip) {
        tooltip.hide();
        tooltip.dispose();
      }
    });
  }

  goFormOrders() {
    this.clearTooltips();
    this.router.navigate(['orders/form-orders']);
  }

  editOrder(orden: Device) {
    this.clearTooltips();
    this.router.navigate(['orders/form-orders'], {
      state: { orderEdit: orden, mode: 'edit' },
    });
  }

  deleteOrder(orden: Device): void {
    if (!orden.id) {
      Swal.fire({
        title: 'No se pudo eliminar',
        text: 'La orden no tiene un identificador válido.',
        icon: 'error',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    Swal.fire({
      title: '¿Eliminar orden?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-danger me-2',
        cancelButton: 'btn btn-secondary',
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.devicesService.delete(orden.id!).subscribe({
        next: () => {
          this.ordenes = this.ordenes.filter((order) => order.id !== orden.id);
          Swal.fire({
            title: 'Orden eliminada',
            text: 'La orden fue eliminada correctamente.',
            icon: 'success',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        },
        error: () => {
          Swal.fire({
            title: 'No se pudo eliminar',
            text: 'Ocurrió un error al eliminar la orden.',
            icon: 'error',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        },
      });
    });
  }
}
