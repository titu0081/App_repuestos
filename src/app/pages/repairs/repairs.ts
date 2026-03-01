import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DevicesService } from '../../services/devices.service';
import {
  Device,
  Part,
  RepairConsuming,
  Repairs as RepairPayload,
} from '../../models/interfaces.models';
import { RepairsService } from '../../services/reparis.service';
import { PartsService } from '../../services/parts.service';
import { RepairConsumingService } from '../../services/repair-consuming.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-repairs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './repairs.html',
  styleUrl: './repairs.scss',
})
export class Repairs implements OnInit {
  constructor(
    private devicesService: DevicesService,
    private repairsService: RepairsService,
    private partsService: PartsService,
    private repairConsumingService: RepairConsumingService,
    private fb: FormBuilder,
  ) {
    // Uso de Formularios dinámicos: formulario principal del header.
    this.repairForm = this.fb.group({
      orderId: ['', [Validators.required]],
      startedAt: [this.getNowDateTimeLocal(), [Validators.required]],
      finishedAt: [this.getNowDateTimeLocal(), [Validators.required]],
      actionsPerformed: ['', [Validators.required]],
    });

    // Uso de Formularios dinámicos: FormArray para ítems seleccionados (part_id + quantity).
    this.repairConsumptionsForm = this.fb.group({
      items: this.fb.array([]),
    });
  }

  orders: Device[] = [];
  parts: Part[] = [];
  repairForm: FormGroup;
  repairConsumptionsForm: FormGroup;
  submitted = false;
  isSubmitting = signal(false);

  // Uso de Señales: estado reactivo de UI para bloquear header y habilitar acciones del body.
  headerLocked = signal(false);
  canSearchParts = signal(false);
  isSavingConsumptions = signal(false);
  selectedConsumptionsCount = signal(0);
  canSaveConsumptions = computed(
    () =>
      this.canSearchParts() &&
      this.selectedConsumptionsCount() > 0 &&
      !this.isSavingConsumptions(),
  );
  // Uso de Señales: estado del botón Guardar reparación.
  canSaveRepair = computed(() => !this.headerLocked() && !this.isSubmitting());

  isLoadingParts = false;
  showPartsTable = false;
  selectedPartMap: Record<number, boolean> = {};
  currentRepairId: number | null = null;
  technicianName = this.getAuthUserName();

  ngOnInit(): void {
    this.consultOrders();
  }

  consultOrders() {
    this.orders = [];
    this.devicesService.get().subscribe({
      next: (data) => {
        this.orders = data.data;
      },
      error: () => {
        Swal.fire({
          title: 'Error al cargar órdenes',
          text: 'No se pudieron cargar las órdenes. Inténtalo nuevamente.',
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
    });
  }

  onSubmitHeader(): void {
    this.submitted = true;
    if (!this.repairForm.valid) {
      return;
    }

    const technicianUserId = this.getAuthUserId();
    if (!technicianUserId) {
      Swal.fire({
        title: 'Usuario inválido',
        text: 'No se pudo identificar el técnico logueado.',
        icon: 'error',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    this.isSubmitting.set(true);
    const { orderId, startedAt, finishedAt, actionsPerformed } =
      this.repairForm.getRawValue();

    const body: RepairPayload = {
      device_id: Number(orderId),
      technician_user_id: technicianUserId,
      started_at: this.toApiDateTime(startedAt),
      finished_at: this.toApiDateTime(finishedAt),
      actions_performed: actionsPerformed,
    };

    this.repairsService.post(body).subscribe({
      next: (response) => {
        this.currentRepairId = response.id ?? null;
        this.headerLocked.set(true);
        this.canSearchParts.set(true);
        this.repairForm.disable();
        Swal.fire({
          title: 'Reparación guardada',
          text: 'La reparación se registró correctamente.',
          icon: 'success',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
      error: (error: unknown) => {
        Swal.fire({
          title: 'No se pudo guardar',
          text: this.getRequestErrorMessage(error),
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  get consumptionsArray(): FormArray {
    return this.repairConsumptionsForm.get('items') as FormArray;
  }

  get f() {
    return this.repairForm.controls;
  }

  private resetHeaderForm(): void {
    this.repairForm.reset({
      orderId: null,
      startedAt: this.getNowDateTimeLocal(),
      finishedAt: this.getNowDateTimeLocal(),
      actionsPerformed: '',
    });
    this.submitted = false;
  }

  private getNowDateTimeLocal(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private toApiDateTime(value: string): string {
    if (!value) {
      return `${this.getNowDateTimeLocal().replace('T', ' ')}:00`;
    }

    if (value.includes('T')) {
      return `${value.replace('T', ' ')}:00`;
    }

    return value;
  }

  private getAuthUserId(): number {
    const authUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
    const userId = Number(authUser.id);
    return Number.isNaN(userId) ? 0 : userId;
  }

  private getAuthUserName(): string {
    return (
      JSON.parse(localStorage.getItem('auth_user') || '{}').name || 'Usuario'
    );
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

  searchParts(): void {
    if (!this.canSearchParts() || this.isLoadingParts) {
      return;
    }

    this.isLoadingParts = true;
    this.showPartsTable = false;
    this.parts = [];
    this.selectedPartMap = {};
    this.clearConsumptions();

    this.partsService.get().subscribe({
      next: (response) => {
        this.parts = response.data;
        this.showPartsTable = true;
      },
      error: () => {
        Swal.fire({
          title: 'No se pudieron cargar repuestos',
          text: 'Inténtalo de nuevo más tarde.',
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
      complete: () => {
        this.isLoadingParts = false;
      },
    });
  }

  onPartToggle(part: Part, checked: boolean): void {
    if (!part.id) {
      return;
    }

    this.selectedPartMap[part.id] = checked;

    if (!checked) {
      this.removeConsumption(part.id);
    } else {
      this.upsertConsumption(part.id, 1);
    }

    this.syncSelectedCount();
  }

  onPartQuantityChange(part: Part, quantityValue: string): void {
    if (!part.id) {
      return;
    }

    const parsedQuantity = Number(quantityValue);
    const quantity =
      Number.isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity;

    this.selectedPartMap[part.id] = true;
    this.upsertConsumption(part.id, quantity);
    this.syncSelectedCount();
  }

  getPartQuantity(partId?: number): number {
    if (!partId) {
      return 1;
    }

    const index = this.getConsumptionIndex(partId);
    if (index < 0) {
      return 1;
    }

    const quantity = Number(this.consumptionsArray.at(index).value.quantity);
    return Number.isNaN(quantity) || quantity < 1 ? 1 : quantity;
  }

  saveSelectedParts(): void {
    if (!this.currentRepairId) {
      Swal.fire({
        title: 'Reparación no disponible',
        text: 'Primero guarda la reparación para poder agregar consumos.',
        icon: 'warning',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    if (this.consumptionsArray.length === 0) {
      Swal.fire({
        title: 'Sin repuestos seleccionados',
        text: 'Debes seleccionar al menos un repuesto con su cantidad.',
        icon: 'warning',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    const createdByUserId = this.getAuthUserId();
    if (!createdByUserId) {
      Swal.fire({
        title: 'Usuario inválido',
        text: 'No se pudo identificar el usuario logueado.',
        icon: 'error',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }

    const payloads: RepairConsuming[] = this.consumptionsArray.controls.map(
      (control) => ({
        repair_id: this.currentRepairId!,
        part_id: Number(control.value.part_id),
        quantity: Number(control.value.quantity),
        created_by_user_id: createdByUserId,
      }),
    );

    this.isSavingConsumptions.set(true);
    forkJoin(
      payloads.map((payload) => this.repairConsumingService.post(payload)),
    ).subscribe({
      next: () => {
        Swal.fire({
          title: 'Consumos guardados',
          text: 'Los repuestos seleccionados fueron registrados correctamente.',
          icon: 'success',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        this.selectedPartMap = {};
        this.clearConsumptions();
      },
      error: (error: unknown) => {
        Swal.fire({
          title: 'No se pudo guardar el consumo',
          text: this.getRequestErrorMessage(error),
          icon: 'error',
          buttonsStyling: false,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
      complete: () => {
        this.isSavingConsumptions.set(false);
      },
    });
  }

  private getConsumptionIndex(partId: number): number {
    return this.consumptionsArray.controls.findIndex(
      (control) => Number(control.value.part_id) === partId,
    );
  }

  private upsertConsumption(partId: number, quantity: number): void {
    const index = this.getConsumptionIndex(partId);
    if (index >= 0) {
      this.consumptionsArray.at(index).patchValue({ quantity });
      return;
    }

    this.consumptionsArray.push(
      this.fb.group({
        part_id: [partId, [Validators.required]],
        quantity: [quantity, [Validators.required, Validators.min(1)]],
      }),
    );
  }

  private removeConsumption(partId: number): void {
    const index = this.getConsumptionIndex(partId);
    if (index >= 0) {
      this.consumptionsArray.removeAt(index);
    }
  }

  private clearConsumptions(): void {
    while (this.consumptionsArray.length > 0) {
      this.consumptionsArray.removeAt(0);
    }
    this.syncSelectedCount();
  }

  private syncSelectedCount(): void {
    this.selectedConsumptionsCount.set(this.consumptionsArray.length);
  }
}
