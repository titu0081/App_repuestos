import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';
import { Repairs, LaravelResponse } from '../models/interfaces.models';

@Injectable({
  providedIn: 'root',
})
export class RepairsService {
  private readonly endpoint = '/repairs';

  constructor(private api: ApiHttpService) {}

  get(): Observable<LaravelResponse<Repairs>> {
    return this.api.get<LaravelResponse<Repairs>>(this.endpoint);
  }

  getByID(id: number): Observable<Repairs> {
    return this.api.get<Repairs>(`${this.endpoint}/${id}`);
  }

  post(data: Repairs): Observable<Repairs> {
    return this.api.post<Repairs, Repairs>(this.endpoint, data);
  }

  put(id: number, data: Repairs): Observable<Repairs> {
    return this.api.put<Repairs, Repairs>(`${this.endpoint}/${id}`, data);
  }

  patch(id: number, data: Repairs): Observable<Repairs> {
    return this.api.patch<Repairs, Repairs>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
