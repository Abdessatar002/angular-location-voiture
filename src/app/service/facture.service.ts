import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Facture } from '../model/facture';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  private host = environment.apiUrl

  constructor(private http: HttpClient) { }

  public getAllFacture(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.host}/facture`)
  }
}
