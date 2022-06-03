import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Contrat } from '../model/contrat';
import { Voiture } from '../model/voiture';
import { ContratService } from '../service/contrat.service';
import { DocumentService } from '../service/document.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';
import { VoitureService } from '../service/voiture.service';


@Component({
  selector: 'app-voiture-details',
  templateUrl: './voiture-details.component.html',
  styleUrls: ['./voiture-details.component.css']
})
export class VoitureDetailsComponent implements OnInit {

  mod: String[];
  public voiture: Voiture = new Voiture();
  public doc: File;
  public docId: number;
  public contratListByMatricule: Contrat[] = []
  voitureMatricule: string;
  contratListByMatriculeTest: Contrat[];
  listOfyears: number[] = [];
  endYear: number = new Date().getFullYear();
  totalRevennu: number;
  constructor(private sharedPrintedContratService: SharedPrintContratService, private activeRoute: ActivatedRoute, private voitureService: VoitureService, private docService: DocumentService, private contratService: ContratService) { }

  ngOnInit(): void {
    Chart.register(...registerables);

    this.getOneVoiture();
    this.getRevenuAnnuel(new Date().getFullYear())

  }

  getRevenuAnnuel(year: number) {
    const voitureId = +this.activeRoute.snapshot.paramMap.get('id');
    this.contratService.getRevenuAnnuel(year, voitureId).subscribe(res => {
      let months = res.map(res => res.month);
      let totals = res.map(res => res.total);
      this.totalRevennu = 0
      res.map(res => this.totalRevennu += res.total);

      var chartExist = Chart.getChart('ctx1')
      if (chartExist != undefined)
        chartExist.destroy();

      const chart = new Chart('ctx1', {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'total',
            data: totals,
            pointStyle: 'circle',
            pointRadius: 15,
            pointHoverRadius: 20
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Revenu annuel'
            }
          },
        }
      });
    })

  }


  selectPrntedContrat(cont) {
    this.sharedPrintedContratService.sendContratData(cont);
  }

  public getOneVoiture() {
    const voitureId = +this.activeRoute.snapshot.paramMap.get('id');
    this.voitureService.getOneVoiture(voitureId).subscribe(
      data => {
        this.voiture = data
        this.getContratByVoitureMatricule();

        for (let i = new Date(this.voiture.createdAt).getFullYear(); i <= new Date().getFullYear(); i++) {
          this.listOfyears.push(i)
        }


      },
      (error: HttpErrorResponse) => {
        console.log(error.error.message)
      }
    )
  }

  public getContratByVoitureMatricule() {
    this.contratService.getVoitureByMatricule(this.voiture.matricule).subscribe(
      (data: Contrat[]) => {
        this.contratListByMatricule = data

      }
    )
  }



  addDoc(uploadForm: NgForm) {
    const formData = new FormData();
    formData.append('id', JSON.stringify(this.voiture.id));
    formData.append('fileName', uploadForm.value.fileName);
    formData.append('file', this.doc);
    this.voitureService.addVoitureDoc(formData).subscribe(
      data => {
        document.getElementById('closeModal').click();
        uploadForm.reset();
        this.getOneVoiture();


      }
    )
  }

  deleteVoitureDoc() {
    this.docService.deletDocument(this.docId).subscribe(
      data => {
        document.getElementById('closeModeldelete').click();
        this.getOneVoiture();
      }
    )
  }

  getDoc(file: File) {
    this.doc = file;
  }

  public openModelAddDoc() {
    document.getElementById('openModalAddDoc').click()
  }
  openModelDelete(docId: number) {
    document.getElementById('OpenModelDelete').click()
    this.docId = docId;
  }

}


