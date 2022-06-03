import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contrat } from '../model/contrat';
import { Entreprise } from '../model/entreprise';
import { ContratService } from '../service/contrat.service';
import { EnterpriseService } from '../service/enterprise.service';
import { SharedPrintContratService } from '../service/shared-print-contrat.service';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrls: ['./enterprise-details.component.css']
})
export class EnterpriseDetailsComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  listContratByClientId: Contrat[] = [];
  enterprise: Entreprise;
  constructor(private enterpriseService: EnterpriseService, private contartService: ContratService, private router: ActivatedRoute, private printContratService: SharedPrintContratService) { }


  ngOnInit(): void {
    this.getContratByEnterpriseId();
    this.getEnterpriseById();
  }
  getEnterpriseById() {
    const enterpriseId: number = +this.router.snapshot.paramMap.get('enterpriseid');
    this.subscription.push(this.enterpriseService.getEnterprise(enterpriseId).subscribe(
      (data: Entreprise) => {
        this.enterprise = data;
      }
    ))
  }
  getContratByEnterpriseId() {
    const enterpriseId: number = +this.router.snapshot.paramMap.get('enterpriseid');
    if (isNaN(enterpriseId)) {
      return;
    }
    this.subscription.push(this.contartService.getContratByClentId(enterpriseId, enterpriseId).subscribe(
      data => {

        this.listContratByClientId = data;
      }
    ))

  }
  printedContrat(cont) {
    this.printContratService.sendContratData(cont);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(e => {
      e.unsubscribe()
    })
  }

}
