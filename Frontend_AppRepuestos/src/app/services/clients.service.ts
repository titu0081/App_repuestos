import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from './api-http.service';
import { Client, LaravelResponse } from '../models/interfaces.models';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly endpoint = '/clients';

  constructor(private api: ApiHttpService) {}

  get(): Observable<LaravelResponse<Client>> {
    return this.api.get<LaravelResponse<Client>>(this.endpoint);
  }

  getByID(id: number): Observable<Client> {
    return this.api.get<Client>(`${this.endpoint}/${id}`);
  }

  post(data: Client): Observable<Client> {
    return this.api.post<Client, Client>(this.endpoint, data);
  }

  put(id: number, data: Client): Observable<Client> {
    return this.api.put<Client, Client>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
