import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Part } from '../../../models/interfaces.models';
import { PartsService } from '../../../services/parts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form_inventory.html',
  styleUrl: './form_inventory.scss',
})
export class FormInventory implements OnInit {
  formInventory: FormGroup;
  submitted = false;
  isSubmitting = false;
  esEditar = false;
  inventarioSeleccionado: Part | null = null;
  titlePage: string = 'Crear Nuevo Inventario';
  nameButton: string = 'Crear Inventario';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private partsService: PartsService,
  ) {
    this.formInventory = this.fb.group({
      skuRepuesto: ['', [Validators.required]],
      nombreRepuesto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const state = history.state as {
      inventarioEditar?: Part;
      mode?: string;
    };

    if (state?.mode === 'edit' && state?.inventarioEditar) {
      this.inventarioSeleccionado = state.inventarioEditar;
      this.esEditar = true;
      this.llenarFormularioParaEdicion();
      return;
    }

    this.esEditar = false;
    this.titlePage = 'Crear Nuevo Inventario';
    this.nameButton = 'Crear Inventario';
  }

  llenarFormularioParaEdicion() {
    if (this.inventarioSeleccionado) {
      this.titlePage = 'Editar Inventario';
      this.nameButton = 'Guardar Cambios';
      this.formInventory.patchValue({
        skuRepuesto: this.inventarioSeleccionado.sku,
        nombreRepuesto: this.inventarioSeleccionado.name,
        descripcion: this.inventarioSeleccionado.description,
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (!this.formInventory.valid) {
      return;
    }

    this.isSubmitting = true;
    const { skuRepuesto, nombreRepuesto, descripcion } =
      this.formInventory.getRawValue();

    const body: Part = {
      sku: skuRepuesto,
      name: nombreRepuesto,
      description: descripcion,
    };

    if (this.esEditar && this.inventarioSeleccionado?.id) {
      this.partsService.patch(this.inventarioSeleccionado.id, body).subscribe({
        next: () => {
          Swal.fire({
            title: 'Inventario actualizado',
            text: 'El repuesto se actualizó correctamente.',
            icon: 'success',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          }).then(() => {
            this.router.navigate(['/inventory']);
          });
        },
        error: (error: unknown) => {
          Swal.fire({
            title: 'No se pudo actualizar',
            text: this.getRequestErrorMessage(error),
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
      return;
    }

    this.partsService.post(body).subscribe({
      next: () => {
        Swal.fire({
          title: 'Inventario creado',
          text: 'El repuesto se registró correctamente.',
          icon: 'success',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        }).then(() => {
          this.router.navigate(['/inventory']);
        });
      },
      error: (error: unknown) => {
        Swal.fire({
          title: 'No se pudo crear',
          text: this.getRequestErrorMessage(error),
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

  cancelForm() {
    this.resetForm();
    this.router.navigate(['/inventory']);
  }

  resetForm() {
    this.formInventory.reset();
    this.submitted = false;
  }

  get f() {
    return this.formInventory.controls;
  }

  private getRequestErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
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

    return 'Ocurrió un error inesperado.';
  }
}
