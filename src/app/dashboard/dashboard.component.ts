import { DatePipe } from '@angular/common';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { title } from 'process';
import { Subscription } from 'rxjs';

import { ClientComponent } from '../client/client.component';
import { Client } from '../model/client';
import { ClientDto } from '../model/clientDto';
import { Contrat } from '../model/contrat';
import { Entreprise } from '../model/entreprise';
import { RemainingDaysOfContrat } from '../model/remainingDaysOfContrat';
import { Voiture } from '../model/voiture';
import { ClientService } from '../service/client.service';
import { ContratService } from '../service/contrat.service';
import { EnterpriseService } from '../service/enterprise.service';
import { NotificationService } from '../service/notification.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';
import { VoitureService } from '../service/voiture.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public clientList: ClientDto[] = [];
  public enterpriseList: Entreprise[] = [];
  public voitureList: Voiture[] = [];
  public beforeExpireList: Voiture[] = [];

  public remainingDaysOfContrat: RemainingDaysOfContrat[] = []
  private subscribtion: Subscription[] = [];
  contratList: Contrat[] = [];
  voitureDisponibleList: Voiture[] = [];
  contratsEnCours: Contrat[] = [];

  totalAssuranceBefore: number;
  totalVisiteBefore: number;
  totalTaxeBefore: number;
  matricules: string[];
  remainingDays: number[];
  constructor(private clientService: ClientService,
    private enterpriseService: EnterpriseService,
    private voitureService: VoitureService,
    private contratService: ContratService,
    private notify: NotificationService,
    private sharedPrintContrat: SharedPrintContratService,
    private datePipe: DatePipe) { }



  ngOnInit(): void {
    this.getContratsEnCours()
    this.getRemainingDaysOfContrat()
    this.countClient();
    this.countVoiture();
    this.countEnterprises();
    this.getAllcontratByDateRetour();
    this.taxeBeforeExpire();
    this.visiteBeforeExpire();
    this.assuranceBeforeExpire();
    this.getAllVoituresDispo()
    Chart.register(...registerables);

  }
  getRemainingDaysOfContrat() {
    this.subscribtion.push(
      this.contratService.getRemainingDaysOfContrat().subscribe(data => {
        this.remainingDaysOfContrat = data
        this.matricules = this.remainingDaysOfContrat.map(m => m.matricule);
        this.remainingDays = this.remainingDaysOfContrat.map(m => m.result);
        this.mainChart();
      })
    )
  }
  getContratsEnCours() {
    this.subscribtion.push(
      this.contratService.getContartsEnCours().subscribe((data: Contrat[]) => {
        this.contratsEnCours = data;
      })
    )
  }
  getAllVoituresDispo() {
    this.voitureService.getAllVoituresDispo().subscribe((data: Voiture[]) => {
      this.voitureDisponibleList = data;
    })
  }
  countVoiture() {
    this.voitureService.getVoitures('').subscribe((data: Voiture[]) => {
      this.voitureList = data;
    })
  }
  public taxeBeforeExpire() {
    this.subscribtion.push(
      this.voitureService.taxeBeforeExpire().subscribe((data: Voiture[]) => {
        this.beforeExpireList = data;
        this.totalTaxeBefore = data.length
      }))

  }

  public visiteBeforeExpire() {
    this.subscribtion.push(
      this.voitureService.visiteBeforeExpire().subscribe((data: Voiture[]) => {
        this.beforeExpireList = data;
        this.totalVisiteBefore = data.length
      }))

  }

  public assuranceBeforeExpire() {
    this.subscribtion.push(
      this.voitureService.assuranceBeforeExpire().subscribe((data: Voiture[]) => {
        this.beforeExpireList = data;
        this.totalAssuranceBefore = data.length
      }))

  }




  countClient() {
    this.subscribtion.push(
      this.clientService.getClients('').subscribe(data => {
        this.clientList = data;
      })
    )

  }

  countEnterprises() {
    this.subscribtion.push(
      this.enterpriseService.getAllEnterprise('').subscribe(data => {
        this.enterpriseList = data;
      })
    )

  }

  mainChart() {

    // Mine charts
    var ctx = document.getElementById('myChart') as HTMLCanvasElement
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.matricules,
        // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Green', 'Purple', 'Orange', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: 'Jours restants',
          data: this.remainingDays,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Jours restants',
          },
          legend: {
            display: false,

          }
        }

      },

    });
  }
  getAllcontratByDateRetour() {
    this.subscribtion.push(
      this.contratService.getAllcontratByDateRetour().subscribe(data => {
        this.contratList = data;
      }))

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
interface City {
  name: string,
  code: string
}
