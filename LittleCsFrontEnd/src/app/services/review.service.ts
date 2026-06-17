import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  postReview(review: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, review);
  }

  deleteReview(customer: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${customer}`);
  }
}