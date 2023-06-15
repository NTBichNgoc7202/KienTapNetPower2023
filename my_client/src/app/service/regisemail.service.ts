import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IRegisEmail } from '../interface/regisEmail';
import { RegisEmail } from '../models/regisEmail';
const baseUrl = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class RegisemailService {
  constructor(private _http: HttpClient) {}
  options = {
    withCredentials: true,
  };
  getEmail(): Observable<IRegisEmail[]> {
    return this._http
      .get<IRegisEmail[]>(`${baseUrl}/regisEmail`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  postEmail(data: RegisEmail) {
    return this._http.post(`${baseUrl}/regisEmail`, data, this.options);
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
