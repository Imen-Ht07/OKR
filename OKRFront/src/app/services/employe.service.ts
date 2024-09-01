import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employe } from '../models/employe';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {
  private apiUrl = 'http://localhost:3000/employee'; 

  constructor(private http: HttpClient) {}

  // Ajouter un nouvel employé
  addEmploye(employe: Employe, photo: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', photo);

    // Ajouter chaque propriété de l'employé dans formData
    for (const key in employe) {
      if (employe.hasOwnProperty(key)) {
        const value = employe[key as keyof Employe];
        if (value !== null) {
          formData.append(key, value.toString()); // Ensure all values are converted to strings
        }
      }
    }

    return this.http.post(`${this.apiUrl}/add`, formData);
  }
  // Mettre à jour les informations d'un employé
  updateEmploye(id: string, employe:Employe): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, employe);
  }

  // Supprimer un employé
  deleteEmploye(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Récupérer tous les employés
  getAllEmployes(): Observable<Employe[]> {
    return this.http.get<Employe[]>(`${this.apiUrl}/lists`);
  }

  // Récupérer un employé par son ID
  getEmployeById(id: string): Observable<Employe> {
    return this.http.get<Employe>(`${this.apiUrl}/ByID/${id}`);
  }

  // Obtenir le nombre total d'employés
  getEmployeCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`);
  }
 
}
