import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IFgpw } from '../interface/fgpw';
import { Fgpw } from '../models/fgpw';
const baseUrl = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class FgpwService {
  constructor(private _http: HttpClient) {}

  resetPassword(data: Fgpw) {
    return this._http
      .post(`${baseUrl}/users/Fgpw`, data)
      .pipe(retry(3), catchError(this.handleError));
  }
  changePassword(phone:string,oldPass: string, newPass: string):Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    let data = {
      phone:phone,
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
