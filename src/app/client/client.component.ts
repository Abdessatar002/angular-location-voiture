import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationType } from '../enum/notification-type.enum';
import { Client } from '../model/client';
import { ClientDto } from '../model/clientDto';
import { ClientService } from '../service/client.service';
import { DatepickService } from '../service/datepick.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit, OnDestroy {

  private subscribtion: Subscription[] = [];
  public clitntForm: FormGroup;
  public clientDto: ClientDto[];
  public client: Client = new Client();
  clientId: number;
  private sortField = '';
  public _currentPage = 1;
  public _itemsPerPage = 10;

  public searchValue: string;

  dataSource: MatTableDataSource<any>;

  constructor(private http: HttpClient, private router: Router, private datePick: DatepickService, private formbuilder: FormBuilder, private datePipe: DatePipe, private clientService: ClientService, private notify: NotificationService) { }
  newDate = new Date();

  // setDate = new Date((this.newDate.getMonth() + 2) + '-' + this.newDate.getDate() + '-' + this.newDate.getFullYear())
  toDayMuinisTenDays = this.datePipe.transform(this.newDate.setDate(this.newDate.getDate() + 10), 'yyyy-MM-dd');



  ngOnInit(): void {

    this.getClients(this.sortField)
    this.buildFormClient();

  }

  public buildFormClient() {
    this.clitntForm = this.formbuilder.group({
      client: this.formbuilder.group({
        nom: new FormControl('', [Validators.required, Validators.minLength(3)]),
        prenom: new FormControl('', [Validators.required, Validators.minLength(3)]),
        address: new FormControl('', [Validators.minLength(10)]),
        tel: new FormControl('', [Validators.minLength(10)]),
        dateDeNaissance: new FormControl('', [Validators.required]),

      }),
      cin: this.formbuilder.group({
        cinId: new FormControl('', [Validators.required, Validators.minLength(5)]),
        valableJusqa: new FormControl('', [Validators.required]),

      }),
      permis: this.formbuilder.group({
        permisId: new FormControl('', [Validators.required, Validators.minLength(5)]),
        valableJusqa: new FormControl('', [Validators.required])
      }),
    })
  }

  get nom() { return this.clitntForm.get('client.nom') };
  get prenom() { return this.clitntForm.get('client.prenom') };
  get address() { return this.clitntForm.get('client.address') };
  get tel() { return this.clitntForm.get('client.tel') };
  get dateDeNaissance() { return this.clitntForm.get('client.dateDeNaissance') };



  get cinId() { return this.clitntForm.get('cin.cinId') };
  get cinValableJusqa() { return this.clitntForm.get('cin.valableJusqa') };


  get permiId() { return this.clitntForm.get('permis.permisId') };
  get permisValableJusqa() { return this.clitntForm.get('permis.valableJusqa') };


  public getClients(sortField: string) {
    this.subscribtion.push(this.clientService.getClients(sortField).subscribe(
      (response: ClientDto[]) => {
        this.clientDto = response;
      },
      (errors: HttpErrorResponse) => {
        this.notify.notify(NotificationType.ERROR, errors.error.message)
      }
    ))


  }
  sortedClientList(sortKey: string) {
    this.getClients(sortKey);
  }

  changePageSize(_itemsPerPage) {
    this._itemsPerPage = _itemsPerPage;
  }
  selectPageOne() {
    this._currentPage = 1;
  }
  addClient() {
    if (this.clitntForm.invalid) {
      this.clitntForm.markAllAsTouched();
      return;
    }
    let clientDto = new ClientDto();
    clientDto.client = this.clitntForm.get('client').value;
    clientDto.cin = this.clitntForm.get('cin').value;
    clientDto.permis = this.clitntForm.get('permis').value;

    this.subscribtion.push(this.clientService.addClient(clientDto).subscribe(
      (response: any) => {
        this.notify.sendNotification(NotificationType.SUCCESS, 'Ajouté avec succés');
        this.getClients(this.sortField);
        this.clitntForm.reset();
        document.getElementById('tabClient').click();


      },
      (error: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, error.error.message);


      }
    ))
  }
  public editClient() {
    this.clientService.editClient(this.client).subscribe(
      (data: Client) => {
        this.notify.sendNotification(NotificationType.SUCCESS, "Modidier avec successé");
        document.getElementById('closeModelEditClient').click();
      },
      (error: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, error.error.message);
      }
    )
  }

  onEditClient(client: Client) {
    document.getElementById('bottunEditClient').click();
    this.client = client;
  }

  public deleteClient() {
    this.subscribtion.push(this.clientService.delectClient(this.clientId).subscribe(
      data => {
        this.notify.sendNotification(NotificationType.SUCCESS, "Client suprimé avec succés")
        this.getClients(this.sortField);
        document.getElementById('closeModeldelete').click()
      },
      (error: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, error.error.message);
      }
    ))


  }

  OpenModelDelete(id: number) {
    document.getElementById('OpenModelDelete').click();
    this.clientId = id;
  }

  public doSearch(key: string) {

    if (key.length == 0) {
      return;
    }
    this.subscribtion.push(this.clientService.searchClientbykey(key).subscribe(
      data => {
        this.clientDto = data;
      },
      (error: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, error.error.message)
      }
    ))


  }

  ngOnDestroy(): void {
    this.subscribtion.forEach(s => {
      s.unsubscribe
    })
  }

}
