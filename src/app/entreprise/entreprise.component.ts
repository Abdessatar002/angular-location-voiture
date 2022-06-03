import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as Chart from 'chart.js';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Entreprise } from '../model/entreprise';
import { EnterpriseService } from '../service/enterprise.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
})
export class EntrepriseComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  enterprises: Entreprise[] = [];
  enterprise: Entreprise = new Entreprise();
  sortKey: string = '';
  public searchValue: string;
  public _currentPage = 1;
  public _itemsPerPage = 10;

  constructor(private enterpriseService: EnterpriseService, private notify: NotificationService) { }

  ngOnInit(): void {
    this.getAllEnterprise(this.sortKey);


  }
  public getAllEnterprise(sortKey: string) {
    this.subscription.push(this.enterpriseService.getAllEnterprise(sortKey).subscribe(
      (data: Entreprise[]) => {
        this.enterprises = data
      },
      (error: HttpErrorResponse) => {
        console.log(error.error.message)
      }
    ))
  }
  sortedEnterpriseList(sortKey: string) {
    this.getAllEnterprise(sortKey);
  }
  changePageSize(_itemsPerPage) {
    this._itemsPerPage = _itemsPerPage;
  }
  selectPageOne() {
    this._currentPage = 1;
  }
  public openModelAddUpdate() {
    document.getElementById('modelAddUpdate').click()
  }

  public addEnterprise(enterpriseForm: NgForm) {
    this.subscription.push(
      this.enterpriseService.addEnterprise(enterpriseForm.value).subscribe(
        data => {
          this.getAllEnterprise(this.sortKey);
          document.getElementById('btn-close-add').click();
          enterpriseForm.reset();
          this.notify.notify(NotificationType.SUCCESS, "Bien ajouter");
        },
        (error: HttpErrorResponse) => {
          this.notify.notify(NotificationType.ERROR, error.error.message);

        }
      ))
  }
  getEditEnterprise(enterprise: Entreprise) {
    this.enterprise = enterprise
    console.log(this.enterprise)
    document.getElementById('openUpdateModel').click()
  }
  public updateEnterprise(enterpriseForm: NgForm) {
    this.subscription.push(
      this.enterpriseService.updateEnterprise(enterpriseForm.value).subscribe(
        data => {
          this.notify.notify(NotificationType.SUCCESS, "Bien modifier");

          document.getElementById('btn-close-update').click()
          this.getAllEnterprise(this.sortKey);
        },
        (error: HttpErrorResponse) => {
          this.notify.notify(NotificationType.ERROR, error.error.message);

        }
      ))
  }

  openModelDeleteenterprises(deletedEnterprise: Entreprise) {
    this.enterprise = deletedEnterprise;
    document.getElementById('opendelteModel').click()
  }

  public deleteEnterprise() {
    this.subscription.push(
      this.enterpriseService.delteEnterprise(this.enterprise.id).subscribe(
        data => {
          this.getAllEnterprise(this.sortKey);
          document.getElementById('closeModeldeleteEnter').click()
          this.notify.notify(NotificationType.SUCCESS, 'Supprimé avec succès')
        },
        (error: HttpErrorResponse) => {
          this.notify.notify(NotificationType.ERROR, error.error.message)

        }
      )
    )
  }



  ngOnDestroy(): void {
    this.subscription.forEach((e) => {
      e.unsubscribe();
    })
  }

}
