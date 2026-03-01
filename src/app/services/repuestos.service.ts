import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';

export interface Repuesto {
  id?: number;
  sku: string;
  nombreRepuesto: string;
  cantidad: number;
  descripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class RepuestosService {
  private readonly endpoint = '/repuestos';

  constructor(private api: ApiHttpService) {}

  listar(): Observable<Repuesto[]> {
    return this.api.get<Repuesto[]>(this.endpoint);
  }

  obtenerPorId(id: number): Observable<Repuesto> {
    return this.api.get<Repuesto>(`${this.endpoint}/${id}`);
  }

  crear(data: Repuesto): Observable<Repuesto> {
    return this.api.post<Repuesto, Repuesto>(this.endpoint, data);
  }

  actualizar(id: number, data: Repuesto): Observable<Repuesto> {
    return this.api.put<Repuesto, Repuesto>(`${this.endpoint}/${id}`, data);
  }

  eliminar(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
