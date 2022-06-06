import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Contrat } from '../model/contrat';
import { ContratService } from '../service/contrat.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';

@Component({
  selector: 'app-print-contrat',
  templateUrl: './print-contrat.component.html',
  styleUrls: ['./print-contrat.component.css']
})
export class PrintContratComponent implements OnInit, OnDestroy {

  public contrat: Contrat;
  public subscription: Subscription[] = [];
  public hideEnterpriseCard: boolean = false;

  constructor(private sharedPrintContrat: SharedPrintContratService, private contratService: ContratService) {

    this.subscription.push(
      this.sharedPrintContrat.getContratData$.subscribe(
        contrat => {
          this.contrat = contrat
          // contratService.generateContratPdf(contrat.id).subscribe(data => {
          //   const file = new Blob([data], { type: 'application/pdf' });
          //   const fileURL = URL.createObjectURL(file);
          //   window.open(fileURL);
          // }, (error: HttpErrorResponse) => {
          //   console.log(error.error.message)

          // }
          // )
          if (this.contrat.driverOne.nom) {
            this.hideEnterpriseCard = true
          } else this.hideEnterpriseCard = false
          setTimeout(() => {
            document.getElementById('printButton1').click();
          });
        }
      )
    )
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe()
    })
  }


  ngOnInit(): void {

  }
}

