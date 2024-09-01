import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resultat } from '../models/resultat'; 

@Injectable({
  providedIn: 'root'
})
export class ResultatService {

  private baseUrl = 'http://localhost:3000/resultat'; 

  constructor(private http: HttpClient) { }

  // Créer un résultat
  createResultat(objectifID: any, resultat: Resultat): Observable<Resultat> {
    return this.http.post<Resultat>(`${this.baseUrl}/${objectifID}/createResultat`, resultat); 
  }

  // Obtenir tous les résultats pour un objectif spécifique
  getAllResultats(objectifID: any): Observable<Resultat[]> {
    return this.http.get<Resultat[]>(`${this.baseUrl}/${objectifID}/resultats`); 
  }
  // Obtenir tous les résultats pour un objectif spécifique
  getAll(): Observable<Resultat[]> {
    return this.http.get<Resultat[]>(`${this.baseUrl}/resultats`); 
  }

  // Obtenir un résultat par son ID
  getResultatById(id: any): Observable<Resultat> {
    return this.http.get<Resultat>(`${this.baseUrl}/resultatByID/${id}`); 
  }

  // Supprimer un résultat
  deleteResultat(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteresultat/${id}`); 
  }

  // Modifier un résultat
  updateResultat(id: any, resultat: Resultat): Observable<Resultat> {
    return this.http.put<Resultat>(`${this.baseUrl}/Updateresultat/${id}`, resultat); 
  }
  countResultstatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/countResult`);
  }
}
