import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  signin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, data).pipe(
      map(response => {
        const data = response as any;
        const token = data.token;
        const role = data.role;
        const user = data.user; // Assuming the server returns the user object
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('user', JSON.stringify(user)); // Store the user object as a string
        return response;
      }),
      catchError(error => {
        const errorMessage = error.message || 'Something went wrong. Please try again later.';
        return throwError(errorMessage);
      })
    );
  }

  signout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/signout`).pipe(
      map(response => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        return response;
      }),
      catchError(error => {
        const errorMessage = error.message || 'Something went wrong. Please try again later.';
        return throwError(errorMessage);
      })
    );
  }

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  changePassword(id: string, oldPassword: any, newPassword: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/change-password/${id}`, { oldPassword, newPassword });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin`);
  }

  getEmployeBoard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/employe`);
  }

  getManagerBoard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/manager`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user/${id}`);
  }

  getCurrentUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    // Include the token in the request headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/user`, { headers }).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(errorMessage);
      })
    );
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin';
  }

  isManagerOrAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin' || role === 'Manager';
  }

isEmploye(): boolean {
  const role = localStorage.getItem('role');
  return role === 'Employee';
}
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }
}
