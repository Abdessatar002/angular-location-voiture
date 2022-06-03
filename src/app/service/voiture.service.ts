import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Voiture } from '../model/voiture';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {
  host = environment.apiUrl;

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public getVoitures(sortField: string): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${this.host}/voiture/all?sortField=${sortField}`)
  }
  getAllVoituresDispo(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${this.host}/voiture/voitures_dispo`)
  }

  public taxeBeforeExpire(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${this.host}/voiture/taxe`)
  }

  public assuranceBeforeExpire(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${this.host}/voiture/assurance`)
  }
  public visiteBeforeExpire(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${this.host}/voiture/visite`)
  }

  public getOneVoiture(id: number): Observable<Voiture> {
    return this.http.get<Voiture>(`${this.host}/voiture/${id}`)
  }

  public addVoiture(formData: FormData): Observable<Voiture> {
    return this.http.post<Voiture>(`${this.host}/voiture/add`, formData)
  }

  public updateVoiture(formData: FormData): Observable<Voiture> {
    return this.http.put<Voiture>(`${this.host}/voiture/update`, formData)
  }

  public addVoitureDoc(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.host}/voiture/upload`, formData)
  }

  public deleteViture(voitureId: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${this.host}/voiture/delete/${voitureId}`)
  }

}
