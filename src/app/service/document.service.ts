import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {



  private host = environment.apiUrl
  constructor(private http: HttpClient) { }



  public deletDocument(id: number): Observable<any> {
    return this.http.delete<void>(`${this.host}/document/${id}`)
  }
}
