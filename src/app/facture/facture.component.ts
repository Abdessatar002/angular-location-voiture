import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Facture } from '../model/facture';
import { FactureService } from '../service/facture.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';



@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {

  constructor(private factureService: FactureService, private sharedPrintService: SharedPrintContratService) { }
  public factures: Facture[] = [];
  public subscriptions: Subscription[] = [];
  public searchValue: string;
  public _currentPage = 1;
  public _itemsPerPage = 10;





  ngOnInit(): void {
    this.getAllFactures();
  }

  public getAllFactures() {
    this.subscriptions.push(
      this.factureService.getAllFacture().subscribe(
        (data: Facture[]) => {
          this.factures = data
        }
      )
    )

  }
  changePageSize(_itemsPerPage) {
    this._itemsPerPage = _itemsPerPage;
  }
  selectPageOne() {
    this._currentPage = 1;
  }
  getPrentedFacture(facture) {
    this.sharedPrintService.sendFactureData(facture);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => {
      s.unsubscribe()
    })

  }

}
