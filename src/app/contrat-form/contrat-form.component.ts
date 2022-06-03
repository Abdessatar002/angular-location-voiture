import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { Client } from '../model/client';
import { ClientDto } from '../model/clientDto';
import { Voiture } from '../model/voiture';
import { ClientService } from '../service/client.service';
import { ContratService } from '../service/contrat.service';
import { NotificationService } from '../service/notification.service';

import { VoitureService } from '../service/voiture.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Contrat } from '../model/contrat';
import { Location } from '@angular/common';
import { EnterpriseService } from '../service/enterprise.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';
import { Subscription } from 'rxjs';
import { Entreprise } from '../model/entreprise';
import { SelectClient } from '../model/select-client';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-contrat-form',
  templateUrl: './contrat-form.component.html',
  styleUrls: ['./contrat-form.component.css']
})
export class ContratFormComponent implements OnInit, OnDestroy {
  private subscribtion: Subscription[] = [];
  public voitures: Voiture[] = [];
  public clients: ClientDto[] = [];
  public client = new Client();
  public isPayer: boolean = false;
  public loading: boolean = false;
  public chow: boolean = false;


  dateNow = new Date(Date.now());
  dateDepart = this.datePipe.transform(this.dateNow, 'yyyy-MM-ddTHH:mm');
  dateRetour = this.datePipe.transform(this.dateNow.setDate(this.dateNow.getDate() + 1), 'yyyy-MM-ddTHH:mm');
  // dateRetour: string = null;
  numberOfDays: number;
  voiture: Voiture = new Voiture();
  public total: number = 0;
  public avance: number = 0;
  public reste: number = 0;
  nomEtPrenom: string;
  hideSelect: boolean = false
  clnt2: Client = new Client();
  contrat: Contrat = new Contrat();
  contratId: number;
  numContrat: any;
  caution: number;
  enterprise: any;
  isClient: boolean = true;
  enterprises: Entreprise[];
  printedContrat: Contrat;
  selectedPerson2: any;
  selectedPerson1: any;
  clientsForSelect: SelectClient[] = [];




  constructor(private activeRout: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private clientService: ClientService,
    private enterpriseService: EnterpriseService,
    private voitureService: VoitureService,
    private contratService: ContratService,
    private notify: NotificationService,
    private sharedPrintContrat: SharedPrintContratService) { }

  ngOnInit(): void {

    this.getOneContrat()
    this.getClientOrEnterprise()
    this.getClients()
    this.getVoitures()
    this.getEnterprises()
    this.getClientForSelect()
    this.calculateDate()


  }


  getClientForSelect() {
    this.clientService.getClientsForSelect().subscribe((data: SelectClient[]) => {
      this.clientsForSelect = data;
    }

    )
  }

  isPayer1(event) {
    this.isPayer = event
  }

  public getOneContrat() {
    if (!this.activeRout.snapshot.paramMap.has('contratid')) {
      return;
    }
    const contratId = +this.activeRout.snapshot.paramMap.get('contratid');
    this.subscribtion.push(this.contratService.getOneContrat(contratId).subscribe(
      (data: Contrat) => {

        this.contrat = data;
        if (this.contrat.driverOne.nom == undefined) {
          this.enterprise = data.driverOne
          this.isClient = false;
        } else if (this.contrat.driverOne.nom != undefined) {
          this.client = data.driverOne
          this.selectedPerson1 = data.driverOne.id;
          this.isClient = true;
        }


        if (this.contrat.driverTwo != undefined) {
          this.clnt2 = this.contrat.driverTwo;
          this.selectedPerson2 = this.contrat.driverTwo.id;

        } else {
          this.contrat.driverTwo = new Client();
        }

        this.caution = this.contrat.caution;
        this.voiture = this.contrat.voiture;
        this.dateDepart = this.datePipe.transform(this.contrat.dateDepart, 'yyyy-MM-ddTHH:mm');
        this.dateRetour = this.datePipe.transform(this.contrat.dateRetour, 'yyyy-MM-ddTHH:mm');
        this.avance = this.contrat.avance;
        this.numberOfDays = this.contrat.numDay;
        this.voiture.tarif = this.contrat.tarif;
        this.calculateTotal();
      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, error.error.message)
      }
    ))

  }


  public getEnterprises() {
    this.subscribtion.push(this.enterpriseService.getAllEnterprise("prenom").subscribe(
      data => {
        this.enterprises = data

      }
    ))


  }
  public getVoitures() {
    this.subscribtion.push(this.voitureService.getVoitures('matricule').subscribe(
      data => {
        this.voitures = data

      }
    ))


  }

  getclient1(id: number) {
    this.subscribtion.push(this.clientService.getOneClient(id).subscribe(
      data => {
        this.client = data;

      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, error.error.message)
      }
    ))



  }
  getclient2(clnt2Id: number) {
    if (clnt2Id == null) {
      this.clnt2 = new Client();
      return
    }
    this.subscribtion.push(this.clientService.getOneClient(clnt2Id).subscribe(
      data => {
        this.clnt2 = data;
      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, error.error.message)
      }
    ))



  }
  public getClients() {
    this.subscribtion.push(this.clientService.getClients('nom').subscribe(
      data => {
        this.clients = data
      }
    ))


  }
  getClientOrEnterprise() {
    if (!(this.activeRout.snapshot.paramMap.has('id') ||
      this.activeRout.snapshot.paramMap.has('enterpriseid'))) {
      return
    }
    if (this.activeRout.snapshot.paramMap.has('id')) {
      this.isClient = true;
      const clientId = +this.activeRout.snapshot.paramMap.get('id');

      this.subscribtion.push(this.clientService.getOneClient(clientId).subscribe(
        data => {
          this.client = data;
          this.hideSelect = true;
        }
      ))


    }
    if (this.activeRout.snapshot.paramMap.has('enterpriseid')) {
      this.isClient = false;

      const enterpriseId = +this.activeRout.snapshot.paramMap.get('enterpriseid');
      this.subscribtion.push(this.enterpriseService.getEnterprise(enterpriseId).subscribe(
        data => {
          this.enterprise = data;
          this.hideSelect = true;
        }
      ))


    }



  }



  public calculateTotal() {
    this.total = this.voiture.tarif * this.numberOfDays;
    this.reste = this.total - this.avance;
    if (isNaN(this.total)) {
      this.total = 0
    }
  }
  calculateReste(avance: number) {
    if (this.total != Number.NaN) {
      this.avance = avance;
      this.reste = this.total - avance;
    }


  }
  getSelecterEnterprise(enterprise: number) {
    this.subscribtion.push(this.enterpriseService.getEnterprise(enterprise).subscribe(
      (data) => {
        this.enterprise = data
      }
    ))



  }

  getSelectedVoiture(voitureId: number) {
    this.subscribtion.push(this.voitureService.getOneVoiture(voitureId).subscribe(
      (data: Voiture) => {
        this.voiture = data;
        this.caution = data.caution;
        this.calculateTotal()
      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, error.error.message)
      }
    ))


  }




  public calculateDate() {
    if (this.dateRetour != '' && this.dateDepart != '') {
      let deff: number = new Date(this.dateRetour).getTime() - new Date(this.dateDepart).getTime();
      let msInDay: number = 1000 * 3600 * 24;
      this.numberOfDays = Math.trunc(deff / msInDay);
      this.calculateTotal();
    }




  }

  public addDayToDate(numDay: number) {
    let deff = new Date(this.dateDepart).getTime() + numDay * 86400000;
    const dy = new Date(deff);
    this.dateRetour = this.datePipe.transform(dy, 'yyyy-MM-ddTHH:mm');
    this.calculateTotal();
  }


  imprimer() {
    setTimeout(time => {
      this.sharedPrintContrat.sendContratData(this.printedContrat)
    })
    this.router.navigate(['/contrat'])
    // this.chow = true;
    // document.getElementById('printButton').click()
    // this.chow = false;
    // this.location.back();
  }
  nePasImprimer() {
    this.router.navigate(['/contrat'])
  }


  public onSubmit(event) {
    if (event.nomberDesJour == Number.NaN || event.nomberDesJour == undefined) {
      event.nomberDesJour = 0;
    }
    if (event.prix == Number.NaN || event.prix == undefined) {
      event.prix = 0;
    }
    if (event.avance == Number.NaN || event.avance == undefined) {
      event.avance = 0;
    }
    this.contratId = 0;
    if (this.activeRout.snapshot.paramMap.has('contratid')) {
      this.contratId = +this.activeRout.snapshot.paramMap.get('contratid')
    }
    const formData = new FormData;
    formData.append("contratId", JSON.stringify(this.contratId))
    if (this.isClient) {
      formData.append("clnt1", JSON.stringify(this.client.id))
    } else {
      formData.append("clnt1", JSON.stringify(this.enterprise.id))
    }
    formData.append("clnt2", JSON.stringify(this.clnt2.id))
    formData.append("voitureId", JSON.stringify(this.voiture.id))
    formData.append("numDay", event.nomberDesJour)
    formData.append("prix", event.prix)
    formData.append("avance", event.avance)
    formData.append("depart", event.dateDeDepart)
    formData.append("retour", event.dateDeRetour)
    formData.append('isPayer', JSON.stringify(this.isPayer))
    formData.append('caution', JSON.stringify(this.caution))
    this.subscribtion.push(this.contratService.addNewContrat(formData).subscribe(
      (data: Contrat) => {
        this.numContrat = data.numContrat
        document.getElementById('model_imprimer').click();
        this.printedContrat = data;
      },
      (error: HttpErrorResponse) => {
        this.notify.notify(NotificationType.DEFAULT, error.error.message)
      }
    ))
  }
  ngOnDestroy(): void {
    this.subscribtion.forEach(s => {
      s.unsubscribe()
    })

  }
}
