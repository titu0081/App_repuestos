import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';
import { Part, LaravelResponse } from '../models/interfaces.models';

@Injectable({
  providedIn: 'root',
})
export class PartsService {
  private readonly endpoint = '/parts';

  constructor(private api: ApiHttpService) {}

  get(): Observable<LaravelResponse<Part>> {
    return this.api.get<LaravelResponse<Part>>(this.endpoint);
  }

  getByID(id: number): Observable<Part> {
    return this.api.get<Part>(`${this.endpoint}/${id}`);
  }

  post(data: Part): Observable<Part> {
    return this.api.post<Part, Part>(this.endpoint, data);
  }

  put(id: number, data: Part): Observable<Part> {
    return this.api.put<Part, Part>(`${this.endpoint}/${id}`, data);
  }

  patch(id: number, data: Part): Observable<Part> {
    return this.api.patch<Part, Part>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
