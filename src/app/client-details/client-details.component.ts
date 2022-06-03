import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NotificationType } from '../enum/notification-type.enum';
import { Client } from '../model/client';
import { ClientDto } from '../model/clientDto';
import { Contrat } from '../model/contrat';
import { Document } from '../model/document';
import { PrintContratComponent } from '../print-contrat/print-contrat.component';
import { ClientService } from '../service/client.service';
import { ContratService } from '../service/contrat.service';
import { DocumentService } from '../service/document.service';
import { NotificationService } from '../service/notification.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {

  public client: Client = new Client();
  public doc: File;
  deletedDocumentId: number;
  document = new Document();
  public contrat: Contrat;

  listContratByClientId: Contrat[] = [];

  constructor(private printContratService: SharedPrintContratService, private clientService: ClientService, private route: ActivatedRoute, private documentService: DocumentService, private notify: NotificationService, private contratService: ContratService) { }

  ngOnInit(): void {

    this.clientService.refresh$.subscribe(
      () => {
        this.getOneClient();

      }
    );
    this.getOneClient();
    this.findContratByClientsId()


  }
  printedContrat(cont) {
    this.printContratService.sendContratData(cont);
  }

  public getOneClient() {
    const clientId = +this.route.snapshot.paramMap.get('id');
    this.clientService.getOneClient(clientId).subscribe(
      data => {
        this.client = data;

      },
      (error: HttpErrorResponse) => {
        console.log(error.error.message)
      }
    )

  }

  public findContratByClientsId() {
    const clientId = +this.route.snapshot.paramMap.get('id');

    this.contratService.getContratByClentId(clientId, clientId).subscribe(
      data => {
        this.listContratByClientId = data;
        console.log(this.listContratByClientId);
      }
    )
  }

  public uploadClientDoc(uploadForm: NgForm) {
    const formData = new FormData();
    formData.append('id', JSON.stringify(this.client.id));
    formData.append('fileName', uploadForm.value.fileName);
    formData.append('docUrl', this.doc);

    this.clientService.uploadClientDoc(formData).subscribe(
      (Response: Client) => {
        this.doc = null;
        uploadForm.reset();
        document.getElementById('closeModal').click();
        this.notify.sendNotification(NotificationType.SUCCESS, "Document ajouté avec succés")
      },
      (error: HttpErrorResponse) => {

        this.notify.sendNotification(NotificationType.ERROR, error.error.message);
      }
    )
  }


  public deleteDocument() {

    this.documentService.deletDocument(this.deletedDocumentId).subscribe(
      data => {
        this.getOneClient();
        this.notify.sendNotification(NotificationType.SUCCESS, 'Supprimé avec succesé')
        document.getElementById('closeModeldelete').click();

      }
      ,
      (error: HttpErrorResponse) => {
        this.notify.sendNotification(NotificationType.ERROR, error.error.message);
      }
    )
  }

  OpenModelDelete(id: number) {
    console.log(id)
    this.deletedDocumentId = id;
    document.getElementById('OpenModelDelete').click();
  }

  onDocChanege(doc: File) {
    this.doc = doc;
    console.log(doc)

  }
  submitUploadForm() {
    document.getElementById('submitUploadForm').click();
  }


  openModalAddImage() {
    document.getElementById('openModalAddImage').click();
  }

}
