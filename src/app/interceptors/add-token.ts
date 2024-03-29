import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddTokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('example-token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'Application/json',
    });
    const authReq = req.clone({
      headers: headers,
    });

    return next.handle(authReq);
  }
}
