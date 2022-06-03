import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entreprise } from '../model/entreprise';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  private host = environment.apiUrl
  constructor(private http: HttpClient) { }

  public addEnterprise(enterprise: Entreprise): Observable<Entreprise> {
    return this.http.post<Entreprise>(`${this.host}/enterprise`, enterprise)
  }
  public delteEnterprise(enterpriseId: number): Observable<any> {
    return this.http.delete<any>(`${this.host}/enterprise/${enterpriseId}`)

  }
  public updateEnterprise(enterprise: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.host}/enterprise`, enterprise)

  }
  public getEnterprise(enterpriseId: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.host}/enterprise/${enterpriseId}`)

  }

  public getAllEnterprise(sortField: string): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.host}/enterprise?sortField=${sortField}`)

  }
}
