import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Contrat } from '../model/contrat';
import { Facture } from '../model/facture';

@Injectable({
  providedIn: 'root'
})
export class SharedPrintContratService {
  private subjectContrat = new Subject<Contrat>();
  getContratData$ = this.subjectContrat.asObservable();

  private subjectFacture = new Subject<Facture>();
  getFactureData$ = this.subjectFacture.asObservable();
  constructor() { }

  public sendContratData(contrat: Contrat) {
    this.subjectContrat.next(contrat);
  }

  public sendFactureData(facture: Facture) {
    this.subjectFacture.next(facture);
  }

}
