import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';
import {
  RepairConsuming,
  LaravelResponse,
  Repairs,
} from '../models/interfaces.models';

@Injectable({
  providedIn: 'root',
})
export class RepairConsumingService {
  private readonly endpoint = '/repair-consumptions';

  constructor(private api: ApiHttpService) {}

  get(): Observable<LaravelResponse<RepairConsuming>> {
    return this.api.get<LaravelResponse<RepairConsuming>>(this.endpoint);
  }

  getByID(id: number): Observable<RepairConsuming> {
    return this.api.get<RepairConsuming>(`${this.endpoint}/${id}`);
  }

  post(data: RepairConsuming): Observable<RepairConsuming> {
    return this.api.post<RepairConsuming, RepairConsuming>(this.endpoint, data);
  }

  put(id: number, data: RepairConsuming): Observable<RepairConsuming> {
    return this.api.put<RepairConsuming, RepairConsuming>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  patch(id: number, data: RepairConsuming): Observable<RepairConsuming> {
    return this.api.patch<RepairConsuming, RepairConsuming>(
      `${this.endpoint}/${id}`,
      data,
    );
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
