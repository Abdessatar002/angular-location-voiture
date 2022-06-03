import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Client } from '../model/client';
import { ClientDto } from '../model/clientDto';
import { tap } from 'rxjs/operators';
import { SelectClient } from '../model/select-client';



@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private _refresh$ = new Subject<void>();
  private host = environment.apiUrl
  constructor(private http: HttpClient) { }

  get refresh$() {
    return this._refresh$
  }

  public addClient(client: ClientDto): Observable<any> {
    return this.http.post<any>(`${this.host}/person/add`, client)
  }

  public getClientsForSelect(): Observable<SelectClient[]> {
    return this.http.get<SelectClient[]>(`${this.host}/person/selectClients`)
  }

  public editClient(client: Client): Observable<any> {
    return this.http.put<any>(`${this.host}/person/update`, client)
  }

  public getClients(sortField: string): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${this.host}/person/all?sortField=${sortField}`)

  }


  public getOneClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.host}/person/${id}`)

  }

  public delectClient(id: number): Observable<Client> {
    return this.http.delete<Client>(`${this.host}/person/delete/${id}`)
  }
  public searchClientbykey(key: string): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${this.host}/person/search/${key}`)
  }

  public uploadClientDoc(formData: FormData): Observable<Client> {
    return this.http.post<Client>(`${this.host}/person/upload`, formData).pipe(
      tap(
        () => {
          this.refresh$.next();
        }
      )
    )
  }
}


