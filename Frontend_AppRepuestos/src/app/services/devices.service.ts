import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';
import { Device, LaravelResponse } from '../models/interfaces.models';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private readonly endpoint = '/devices';

  constructor(private api: ApiHttpService) {}

  get(): Observable<LaravelResponse<Device>> {
    return this.api.get<LaravelResponse<Device>>(this.endpoint);
  }

  getByID(id: number): Observable<Device> {
    return this.api.get<Device>(`${this.endpoint}/${id}`);
  }

  post(data: Device): Observable<Device> {
    return this.api.post<Device, Device>(this.endpoint, data);
  }

  put(id: number, data: Device): Observable<Device> {
    return this.api.put<Device, Device>(`${this.endpoint}/${id}`, data);
  }

  patch(id: number, data: Device): Observable<Device> {
    return this.api.patch<Device, Device>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
