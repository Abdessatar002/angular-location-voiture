import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NotificationType } from '../enum/notification-type.enum';
import { Client } from '../model/client';
import { Contrat } from '../model/contrat';
import { PrintContratComponent } from '../print-contrat/print-contrat.component';
import { ContratService } from '../service/contrat.service';
import { NotificationService } from '../service/notification.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';
import { ContratFilterPipe } from '../filter/contrat-filter.pipe';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-contrat',
  templateUrl: './contrat.component.html',
  styleUrls: ['./contrat.component.css'],

})


export class ContratComponent implements OnInit {
  private subscribtion: Subscription[] = [];
  public contratList: Contrat[] = [];
  deletedContratId: number;
  selectedContrat: Contrat = new Contrat();
  public searchValue: string;
  public _currentPage = 1;
  public _itemsPerPage = 10;

  constructor(private contratService: ContratService, private notify: NotificationService, private sharedPrintContrat: SharedPrintContratService) {
  }

  ngOnInit(): void {
    this.getAllContrat();
  }

  public getAllContrat() {
    this.subscribtion.push(this.contratService.getAllcontrat().subscribe(
      (data) => {
        this.contratList = data;
      }
    ))

  }

  changePageSize(_itemsPerPage) {
    this._itemsPerPage = _itemsPerPage;
  }
  selectPageOne() {
    this._currentPage = 1;
  }

  public openModelDeleteContrat(contratId: number) {
    this.deletedContratId = contratId;
    document.getElementById('open_delete_econtrat').click();
  }

  deleteContra() {
    this.subscribtion.push(this.contratService.deleteContrat(this.deletedContratId).subscribe(
      data => {
        this.notify.notify(NotificationType.SUCCESS, 'Contra supprimer avec succé')
        this.getAllContrat();
        this.deletedContratId = null;
      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, error.error.message)
      }
    ))


  }
  public printSelectedContrat(selectedContrat: Contrat) {
    this.sharedPrintContrat.sendContratData(selectedContrat);
  }

  ngOnDestroy(): void {
    this.subscribtion.forEach(s => {
      s.unsubscribe()
    })

  }
}
