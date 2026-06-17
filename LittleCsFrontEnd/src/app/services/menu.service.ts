import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { routes } from '../app.routes';
import { environment } from '../environments';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) { }

  // Fetches the full menu from PostgreSQL
  getMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Post menu items
  postMenuItem(item: any):
  Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  // Future Admin Logic: Toggle if an item is sold out
  updateAvailability(id: number, available: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { is_available: available });
  }

  // Delete menu items
  deleteMenuItem(id: number):
  Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
