import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IRegisEmail } from '../interface/regisEmail';
import { RegisEmail } from '../models/regisEmail';
import { Connect } from './connect.service';
@Injectable({
  providedIn: 'root',
})
export class RegisemailService {
  public baseUrl: string = '';
  constructor(private _http: HttpClient, private _connect: Connect) {
    this._connect.url.subscribe({
      next: (res) => {
        this.baseUrl = res;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }
  options = {
    withCredentials: true,
  };
  getEmail(): Observable<IRegisEmail[]> {
    return this._http
      .get<IRegisEmail[]>(`${this.baseUrl}/regisEmail`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  postEmail(data: RegisEmail) {
    return this._http.post(`${this.baseUrl}/regisEmail`, data, this.options);
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
