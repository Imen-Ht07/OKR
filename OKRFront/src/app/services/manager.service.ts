import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manager } from '../models/manager';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:3000/manager'; 

  constructor(private http: HttpClient) {}

  // Ajouter un nouveau manager
  addManager(manager: Manager,photo:File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);
    // Add each manager property to the formData
    Object.keys(manager).forEach(key => {
      const value = manager[key as keyof Manager];
      if (value !== null) {
        formData.append(key, value.toString());  // Ensure values are converted to strings where needed
      }
    });
    return this.http.post(`${this.apiUrl}/add`, formData);
  }
  // Obtenir le nombre total de managers
  getCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }

  // Récupérer tous les managers
  getAllManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/lists`);
  }

  // Mettre à jour les informations d'un manager
  updateManager(id: string, manager:Manager): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, manager);
  }

  // Supprimer un manager
  deleteManager(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Récupérer un manager par son ID
  getManagerById(id: string): Observable<Manager> {
    return this.http.get<Manager>(`${this.apiUrl}/ByID/${id}`);
  }

}
