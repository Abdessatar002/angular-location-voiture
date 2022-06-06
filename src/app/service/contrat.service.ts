import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contrat } from '../model/contrat';
import { RemainingDaysOfContrat } from '../model/remainingDaysOfContrat';

@Injectable({
  providedIn: 'root'
})
export class ContratService {
  private host = environment.apiUrl

  constructor(private http: HttpClient) { }

  addNewContrat(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.host}/contrat`, formData)
  }
  getRevenuAnnuel(year: number, voitureId: number): Observable<any> {
    return this.http.get<any>(`${this.host}/contrat/revenu/${year}/${voitureId}`)
  }
  generateContratPdf(contratId: number): any {
    const httpOptions = {
      //responseType: 'arraybuffer' as 'json'
      responseType: 'blob' as 'json'        //This also worked
    };
    return this.http.get<any>(`${this.host}/contrat/contrat-pdf?contratId=${contratId}`, httpOptions)
  }
  getContartsEnCours(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.host}/contrat/en_location`)
  }
  getRemainingDaysOfContrat(): Observable<RemainingDaysOfContrat[]> {
    return this.http.get<RemainingDaysOfContrat[]>(`${this.host}/contrat/remaining_days`)
  }
  getAllcontrat(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.host}/contrat`)
  }
  getAllcontratByDateRetour(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.host}/contrat/retour`)
  }
  getOneContrat(contratId: number): Observable<Contrat> {
    return this.http.get<Contrat>(`${this.host}/contrat/${contratId}`)
  }
  getVoitureByMatricule(voitureMatricule: string): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.host}/contrat/list/contrat_by/${voitureMatricule}`)
  }
  getContratByClentId(driverOne: number, diverTwo: number): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.host}/contrat/by_client/${driverOne}/${diverTwo}`)
  }
  deleteContrat(contratId: number): Observable<void> {
    return this.http.delete<void>(`${this.host}/contrat/${contratId}`)

  }

}
