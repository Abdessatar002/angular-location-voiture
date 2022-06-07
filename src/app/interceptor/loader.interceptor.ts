import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../service/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loader: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loader.isLoading.next(true);
    return next.handle(request).pipe(
      finalize(
        () => {
          this.loader.isLoading.next(false)
        }
      )
    )
  }
}
