import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { ClientComponent } from './client/client.component';
import { ContratFormComponent } from './contrat-form/contrat-form.component';
import { ContratComponent } from './contrat/contrat.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EnterpriseDetailsComponent } from './enterprise-details/enterprise-details.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { FactureComponent } from './facture/facture.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login.component';
import { PrintContratComponent } from './print-contrat/print-contrat.component';
import { PrintedFactureComponent } from './printed-facture/printed-facture.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { VoitureDetailsComponent } from './voiture-details/voiture-details.component';
import { AddVoitureComponent } from './voiture/addVoiture/add-voiture/add-voiture.component';
import { VoitureComponent } from './voiture/voiture.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user/management', component: UserComponent, canActivate: [AuthenticationGuard] },
  { path: 'home', component: DashboardComponent, canActivate: [AuthenticationGuard] },
  { path: 'voiture', component: VoitureComponent, canActivate: [AuthenticationGuard] },
  { path: 'voiture/:id', component: VoitureDetailsComponent, canActivate: [AuthenticationGuard] },
  { path: 'client', component: ClientComponent, canActivate: [AuthenticationGuard] },
  { path: 'client/:id', component: ClientDetailsComponent, canActivate: [AuthenticationGuard] },
  { path: 'entreprise', component: EntrepriseComponent, canActivate: [AuthenticationGuard] },
  { path: 'enterprise/:enterpriseid', component: EnterpriseDetailsComponent, canActivate: [AuthenticationGuard] },
  { path: 'newcontrat/enterprise/:enterpriseid', component: ContratFormComponent, canActivate: [AuthenticationGuard] },
  { path: 'contrat', component: ContratComponent, canActivate: [AuthenticationGuard] },
  { path: 'contrat/:contratid', component: ContratFormComponent, canActivate: [AuthenticationGuard] },
  { path: 'newcontrat/:id', component: ContratFormComponent, canActivate: [AuthenticationGuard] },
  { path: 'newcontrat', component: ContratFormComponent, canActivate: [AuthenticationGuard] },
  { path: 'factures', component: FactureComponent, canActivate: [AuthenticationGuard] },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
