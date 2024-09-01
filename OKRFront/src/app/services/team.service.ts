import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:3000/team'; 

  constructor(private http: HttpClient) { }

  // Ajouter une équipe
  addTeam(team: Team): Observable<Team> {
    const url = `${this.apiUrl}/addteam`;
    return this.http.post<Team>(url, team);
  }

  // Obtenir toutes les équipes
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/getteam`);
  }

  // Obtenir une équipe par ID
  getTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/getteambyid/${id}`);
  }

   // Mettre à jour une équipe
   updateTeam(id: string, managerId: string, employeeIds: string[], team: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${managerId}/${employeeIds.join(',')}/updateteam/${id}`, team);
  }

  // Supprimer une équipe
  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteteam/${id}`);
  }
}
