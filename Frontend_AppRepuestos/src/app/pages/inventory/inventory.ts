import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { PartsService } from '../../services/parts.service';
import { Part } from '../../models/interfaces.models';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare const bootstrap: any;

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private partsService: PartsService,
  ) {}
  inventario: Part[] = [];

  ngOnInit(): void {
    this.consultParts();
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

  consultParts() {
    this.inventario = [];
    this.partsService.get().subscribe({
      next: (parts) => {
        this.inventario = parts.data;
      },
      error: () => {
        Swal.fire({
          title: 'Error al cargar inventario',
          text: 'No se pudo cargar el inventario. Inténtalo de nuevo.',
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
    });
  }

  goFormInventory() {
    this.clearTooltips();
    this.router.navigate(['inventory/form-inventory']);
  }

  editInventory(item: Part) {
    this.clearTooltips();
    this.router.navigate(['inventory/form-inventory'], {
      state: { inventarioEditar: item, mode: 'edit' },
    });
  }

  deleteInventory(item: Part): void {
    if (!item.id) {
      Swal.fire({
        title: 'No se pudo eliminar',
        text: 'El registro no tiene un identificador válido.',
        icon: 'error',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    Swal.fire({
      title: '¿Eliminar repuesto?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
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

      this.partsService.delete(item.id!).subscribe({
        next: () => {
          this.inventario = this.inventario.filter(
            (part) => part.id !== item.id,
          );
          Swal.fire({
            title: 'Inventario eliminado',
            text: 'El repuesto fue eliminado correctamente.',
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
            text: 'Ocurrió un error al eliminar el repuesto.',
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
