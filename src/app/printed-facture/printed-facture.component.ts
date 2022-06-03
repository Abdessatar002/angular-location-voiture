import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Facture } from '../model/facture';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';
import * as  writtenNumber from 'written-number';

@Component({
  selector: 'app-printed-facture',
  templateUrl: './printed-facture.component.html',
  styleUrls: ['./printed-facture.component.css']
})
export class PrintedFactureComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = []
  public facture: Facture;
  public numberToLettre: string;
  public cts;
  title: string;
  constructor(private sharedPrintService: SharedPrintContratService) { }


  ngOnInit(): void {
    this.subscription.push(this.sharedPrintService.getFactureData$.subscribe(
      (data: Facture) => {
        this.facture = data;
        this.title = data.id + " " + data.contrat.driverOne.prenom

        this.numberToLettre = writtenNumber(Math.trunc(data.contrat.tarif * data.contrat.numDay), { lang: 'fr' })


        if (this.isFloat(data.contrat.tarif * data.contrat.numDay)) {
          this.cts = ((data.contrat.tarif * data.contrat.numDay).toFixed(2) + "").
            substring(((data.contrat.tarif * data.contrat.numDay).toFixed(2) + "").length - 2)
        } else {
          this.cts = ''
        }

        setTimeout(() => {
          document.getElementById('print-fac').click();
        })
      }
    ))
  }

  isFloat(n): boolean {
    return Number(n) === n && n % 1 !== 0;
  }
  ngOnDestroy(): void {
    this.subscription.forEach((e) => {
      e.unsubscribe();
    })
  }

}
