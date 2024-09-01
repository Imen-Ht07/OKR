import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../models/admin';
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) { }

  updateAdmin(id: string, admin: Admin): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/admin/${id}`, admin);
  }

  getAdminById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/admin/${id}`);
  }
}
