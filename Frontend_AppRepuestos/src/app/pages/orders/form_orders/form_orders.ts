import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ClientsService } from '../../../services/clients.service';
import { Client, Device } from '../../../models/interfaces.models';
import Swal from 'sweetalert2';
import { DevicesService } from '../../../services/devices.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form_orders.html',
  styleUrl: './form_orders.scss',
})
export class FormOrders implements OnInit {
  formOrders: FormGroup;
  submitted = false;
  isSubmitting = false;
  esEditar = false;
  ordenSeleccionada: Device | null = null;
  titlePage: string = 'Crear Nueva Orden';
  nameButton: string = 'Crear Orden';
  clients: Client[] = [];
  private readonly receivedByUserId = 1;
  private status = 'received';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientsService: ClientsService,
    private devicesService: DevicesService,
  ) {
    this.formOrders = this.fb.group({
      receivedAt: [this.getTodayDate(), [Validators.required]],
      serialNumber: ['', [Validators.required]],
      model: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      reportedIssue: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const state = history.state;
    console.log(state);
    this.consultClients();

    if (state?.mode === 'edit' && state?.orderEdit) {
      this.ordenSeleccionada = state.orderEdit;
      this.esEditar = true;
      this.llenarFormularioParaEdicion();
    }
  }

  llenarFormularioParaEdicion() {
    if (this.ordenSeleccionada) {
      this.titlePage = 'Editar Orden';
      this.nameButton = 'Guardar Cambios';
      this.formOrders.patchValue({
        receivedAt: this.toDateInputValue(this.ordenSeleccionada.received_at),
        serialNumber: this.ordenSeleccionada.serial_number,
        model: this.ordenSeleccionada.model,
        clientId: this.ordenSeleccionada.client_id,
        reportedIssue: this.ordenSeleccionada.reported_issue,
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.formOrders.valid) {
      this.isSubmitting = true;
      const { receivedAt, serialNumber, model, clientId, reportedIssue } =
        this.formOrders.getRawValue();

      const body: Device = {
        serial_number: serialNumber,
        model,
        received_at: receivedAt,
        received_by_user_id: this.receivedByUserId,
        client_id: Number(clientId),
        reported_issue: reportedIssue,
        status: this.status,
      };

      if (this.esEditar && this.ordenSeleccionada) {
        this.devicesService
          .patch(this.ordenSeleccionada.id ?? 0, body)
          .subscribe({
            next: () => {
              Swal.fire({
                title: 'Orden actualizada',
                text: 'La orden se actualizó correctamente.',
                icon: 'success',
                buttonsStyling: false,
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              }).then(() => {
                this.router.navigate(['/orders']);
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
      } else {
        this.devicesService.post(body).subscribe({
          next: () => {
            Swal.fire({
              title: 'Orden creada',
              text: 'La orden se registró correctamente.',
              icon: 'success',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(() => {
              this.router.navigate(['/orders']);
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
    }
  }

  cancelForm() {
    this.resetForm();
    this.router.navigate(['/orders']);
  }

  resetForm() {
    this.formOrders.reset();
    this.formOrders.patchValue({ receivedAt: this.getTodayDate() });
    this.submitted = false;
  }

  get f() {
    return this.formOrders.controls;
  }

  private getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private toDateInputValue(value: string): string {
    if (!value) {
      return this.getTodayDate();
    }

    const datePart = value.split(' ')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return this.getTodayDate();
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  consultClients() {
    this.clients = [];
    this.clientsService.get().subscribe({
      next: (responseClient) => {
        if (responseClient.data.length > 0) {
          this.clients = responseClient.data;
        } else {
          Swal.fire({
            title: 'No hay clientes disponibles',
            text: 'No se encontraron clientes en el sistema. Por favor, crea un cliente antes de crear una orden.',
            icon: 'warning',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
          this.clients = [];
        }
      },
      error: (error) => {
        Swal.fire({
          title: 'Error al cargar clientes',
          text: 'No se pudieron cargar los clientes. Por favor, inténtalo de nuevo más tarde.',
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
    });
  }
}
