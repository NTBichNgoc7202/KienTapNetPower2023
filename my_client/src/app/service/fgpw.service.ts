import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Fgpw } from '../models/fgpw';
import { baseUrl, proxyCase } from './server-url';
@Injectable({
  providedIn: 'root',
})
export class FgpwService {
  constructor(private _http: HttpClient) {}
  options = {
    withCredentials: true,
  };
  resetPassword(data: Fgpw) {
    return this._http
      .post(`${baseUrl}/users/Fgpw`, data, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  changePassword(
    phone: string,
    oldPass: string,
    newPass: string
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    };
    let data = {
      phone: phone,
      oldPass: oldPass,
      newPass: newPass,
    };
    return this._http
      .put(`${baseUrl}/users/Fgpw`, data, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
