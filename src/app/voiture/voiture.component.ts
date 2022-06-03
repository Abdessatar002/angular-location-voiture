import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationType } from '../enum/notification-type.enum';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Voiture } from '../model/voiture';
import { DatepickService } from '../service/datepick.service';
import { NotificationService } from '../service/notification.service';
import { VoitureService } from '../service/voiture.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-voiture',
  templateUrl: './voiture.component.html',
  styleUrls: ['./voiture.component.css']
})
export class VoitureComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription[] = []

  public addVoiture: Voiture;
  public listVoiture: Voiture[];
  public selectedVoiture: Voiture;
  public imageUrl: File;
  public imageUrlString: string;
  editVoiture = new Voiture();
  deletedVoiture: Voiture;



  public searchValue: string;
  public _currentPage = 1;
  public _itemsPerPage = 10;

  constructor(private datepicker: DatepickService,
    private voitureService: VoitureService,
    private notify: NotificationService) { }

  sortField = '';

  ngOnInit(): void {
    this.getVoitures(this.sortField)
  }
  public onEditVoiture(form: NgForm) {

    const formData = new FormData();
    formData.append('imageUrl', this.imageUrl);
    formData.append('voiture', JSON.stringify(this.editVoiture));
    this.subscribtion.push(this.voitureService.updateVoiture(formData).subscribe(
      (response: Voiture) => {
        this.imageUrl = null;
        this.getVoitures(this.sortField);
        this.clickButton("closeModelEditVoiture")
        this.notify.sendNotification(NotificationType.SUCCESS, "Véhicule modifié avec succssé.");

      },
      (err: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, err.error.message);
      }
    ))

  }
  public deleteVoiture() {
    this.subscribtion.push(this.voitureService.deleteViture(this.deletedVoiture.id).subscribe(
      (response: CustomHttpRespone) => {
        this.notify.sendNotification(NotificationType.INFO, "Supprimé avec succesé");
        this.imageUrl = null;
        this.clickButton('closeModeldelete');
        this.getVoitures(this.sortField);

      },
      (error: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, error.error.message)
      }
    ))



  }

  public onDeleteButton(voiture) {
    this.clickButton('OpenModelDelete')
    this.deletedVoiture = voiture;
  }


  public onImageChange(imageUrl: File) {
    this.imageUrl = imageUrl
  }

  public onSelectVoiture(selectedVoiture: Voiture) {
    this.clickButton('selectedVoiture');
    this.selectedVoiture = selectedVoiture;
  }


  public onEditButton(editVoiture: Voiture) {

    this.clickButton('bottunEditVoiture');
    this.editVoiture = editVoiture;
    this.imageUrlString = editVoiture.imageUrl;
  }


  submitEditVoitureForm() {
    this.clickButton('submitEditVoitureForm');

  }


  public getVoitures(sortField: string) {
    this.subscribtion.push(this.voitureService.getVoitures(sortField).subscribe(
      (voiture: Voiture[]) => {
        this.listVoiture = voiture
      },
      (err: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, err.error.message)
      }
    ))

  }

  sortedVoitureList(sortKey: string) {

    this.getVoitures(sortKey)

  }
  changePageSize(_itemsPerPage) {
    this._itemsPerPage = _itemsPerPage;
  }
  selectPageOne() {
    this._currentPage = 1;
  }

  public onAddVoiture() {
    this.clickButton("submitAddVoiture");
  }
  submitAddvoiture() {
    this.clickButton("submitVoitureForm");

  }

  private clickButton(button: string) {
    document.getElementById(button).click()
  }

  handleImageInput(file: File) {
    this.imageUrl = file;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrlString = event.target.result;

    }
    reader.readAsDataURL(this.imageUrl);
  }

  closeEditeVoiture() {
    this.getVoitures(this.sortField);
    this.imageUrl = null;
    this.imageUrlString = null;
  }

  ngOnDestroy(): void {
    this.subscribtion.forEach(s => {
      s.unsubscribe
    })
  }

}
