import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Voiture } from 'src/app/model/voiture';
import { DatepickService } from 'src/app/service/datepick.service';
import { VoitureService } from 'src/app/service/voiture.service';
import { VoitureComponent } from '../../voiture.component';

import brands from 'src/app/brand.json';
import { NotificationService } from 'src/app/service/notification.service';
import { NotificationType } from 'src/app/enum/notification-type.enum';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

interface BRAND {
  brand: String;
  models: String[];

}
@Component({
  selector: 'app-add-voiture',
  templateUrl: './add-voiture.component.html',
  styleUrls: ['./add-voiture.component.css']
})
export class AddVoitureComponent implements OnInit, OnDestroy {
  private subscribtion: Subscription[] = [];
  color: string;
  models: String[];
  val3: string;

  constructor(private datePicker: DatepickService,
    private voitureService: VoitureService,
    private router: Router,
    private voitureC: VoitureComponent,
    private notify: NotificationService,
    private datePipe: DatePipe) { }

  public brandModels: BRAND[] = brands;

  public voiture = new Voiture();
  public voitureImageUrl: File;

  ngOnInit(): void {
  }

  public getModele(b: string) {

    if (!b) {
      this.models = null;
      return
    }
    this.brandModels.filter(data => {
      if (data.brand.toUpperCase() == b.toUpperCase()) {
        this.models = data.models;
      }

    })
  }
  public changeColor(color: string) {
    switch (color.toLocaleLowerCase()) {
      case 'blanc':
      case 'white':
        color = 'white'
        break;

      case 'blue':
      case 'bleu':
        color = 'blue'
        break;

      case 'red':
      case 'rouge':
        color = 'red'
        break;

      case 'yellow':
      case 'jaune':
        color = 'yellow'
        break;


      case 'vert':
      case 'green':
        color = 'green'
        break;

      case 'orange':
        color = 'orange'
        break;

      case 'marron':
      case 'brown':
        color = 'brown'
        break;

      case 'rose':
      case 'pink':
        color = 'pink'
        break;

      case 'black':
      case 'noir':
        color = 'black'
        break;

      case 'gray':
      case 'gris':
        color = 'gray'
        break;

      case 'violet':
        color = 'violet'
        break;

      default:
        color = ''
        break;
    }
    document.getElementById('aa').style.backgroundColor = color;
  }

  voitureImageChange(voitureImageUrl: File) {
    this.voitureImageUrl = voitureImageUrl
  }

  submite(voitureAdd: NgForm) {

    this.voiture = voitureAdd.value;
    const formData = new FormData()
    formData.append('imageUrl', this.voitureImageUrl)
    formData.append('voiture', JSON.stringify(this.voiture))

    this.subscribtion.push(this.voitureService.addVoiture(formData).subscribe(
      (data: Voiture) => {
        voitureAdd.reset()
        document.getElementById('voitures').click();
        this.voitureC.getVoitures('');
      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, error.error.message)
      }
    ))




  }

  ngOnDestroy(): void {
    this.subscribtion.forEach(s => {
      s.unsubscribe
    })
  }

}
