import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Objectif } from '../models/objectif';
@Injectable({
  providedIn: 'root'
})
export class ObjectifService {

   private baseUrl = 'http://localhost:3000/objectif';
    constructor(private http: HttpClient) { }
    addObjectif(equipeId:string ,objectif: Objectif): Observable<any> {
  return this.http.post(`${this.baseUrl}/${equipeId}/add`, objectif);
 }
  getAllObjectifs(): Observable<any> {
  return this.http.get(`${this.baseUrl}/objectiflists`);
 }
  updateObjectif(id: string, objectif: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/update/${id}`, objectif);
 }
  deleteObjectif(id: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${id}`);
 }
  getObjectifByID(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/ByID/${id}`);
 }
 countObjectstatus(): Observable<any> {
  return this.http.get(`${this.baseUrl}/count`);
}
}
