// src/app/services/action.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from '../models/action';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private apiUrl = 'http://localhost:3000/action'; 

  constructor(private http: HttpClient) {}

  // Récupérer toutes les actions d'un résultat spécifique
  getActions(resultatId: string): Observable<Action[]> {
    return this.http.get<Action[]>(`${this.apiUrl}/${resultatId}/actions`);
  }

  // Créer une nouvelle action dans un résultat spécifique
  createAction(action:Action, resultatId:string): Observable<Action> {
    return this.http.post<Action>(`${this.apiUrl}/${resultatId}/createAction`, action);
  }

  // Mettre à jour une action existante
  updateAction( actionId: any, action:Action): Observable<Action> {
    return this.http.put<Action>(`${this.apiUrl}/Updateaction/${actionId}`, action);
  }

  // Supprimer une action
  deleteAction( actionId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteaction/${actionId}`);
  }

  // Changer l'état de complétion d'une action
  Complete(action: Action): Observable<Action> {
    return this.http.put<Action>(`${this.apiUrl}/complete/${action._id}`, {
      completed: !action.completed
    });
  }
}