import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { UserService } from './service/user.service';
import { AuthenticationService } from './service/authentication.service';
import { NotifierModule } from 'angular-notifier';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ContratFormComponent } from './contrat-form/contrat-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VoitureComponent } from './voiture/voiture.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import { ClientComponent } from './client/client.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { AddVoitureComponent } from './voiture/addVoiture/add-voiture/add-voiture.component';
import { VoitureDetailsComponent } from './voiture-details/voiture-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPrintModule } from 'ngx-print';
import { ContratComponent } from './contrat/contrat.component';
import { PrintContratComponent } from './print-contrat/print-contrat.component';
import { PrintedFactureComponent } from './printed-facture/printed-facture.component';
import { FactureComponent } from './facture/facture.component';
import { EntrepriseComponent } from './entreprise/entreprise.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { EnterpriseDetailsComponent } from './enterprise-details/enterprise-details.component';
import { ContratFilterPipe } from './filter/contrat-filter.pipe';
import { ClientFilterPipe } from './filter/client-filter.pipe';
import { VoitureFilterPipe } from './filter/voiture-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { EnterpriseFilterPipe } from './filter/enterprise-filter.pipe';
import { FactureFilterPipe } from './filter/facture-filter.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    NavBarComponent,
    ContratFormComponent,
    VoitureComponent,
    ClientComponent,
    ClientDetailsComponent,
    AddVoitureComponent,
    VoitureDetailsComponent,
    ContratComponent,
    PrintContratComponent,
    PrintedFactureComponent,
    FactureComponent,
    EntrepriseComponent,
    EnterpriseDetailsComponent,
    ContratFilterPipe,
    ClientFilterPipe,
    VoitureFilterPipe,
    EnterpriseFilterPipe,
    FactureFilterPipe,
    DashboardComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NotifierModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTabsModule,
    NgbModule,
    NgxPrintModule,
    MatTableModule,
    MatButtonModule,
    NgxPaginationModule,
    DropdownModule,
    InputMaskModule



  ],
  providers: [DatePipe, AuthenticationGuard, UserService, AuthenticationService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
