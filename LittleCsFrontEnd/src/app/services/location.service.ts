import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // Points to your local Python backend route
  private apiUrl = `${environment.apiUrl}/locations`;

  constructor(private http: HttpClient) { }

  // Fetches today's scheduled location from PostgreSQL
  getLocation(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}