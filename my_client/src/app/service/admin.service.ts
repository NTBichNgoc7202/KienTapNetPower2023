import { Admin } from './../models/admin';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  retry,
  throwError,
} from 'rxjs';
import { IAdmin } from '../interface/admin';
import { baseUrl, proxyCase } from './server-url';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(private _http: HttpClient) {}
  options = {
    withCredentials: true,
  };
  getAdmin(): Observable<IAdmin[]> {
    return this._http
      .get<IAdmin[]>(`${baseUrl}/admin`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  logAdmin(data: Admin) {
    return this._http.post(`${baseUrl}/login-admin`, data, this.options);
  }
  signOutAdmin(): Observable<any> {
    return this._http
      .post(`${baseUrl}/signout-admin`, {}, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  checkIsAdmin() {
    return this._http
      .get(`${baseUrl}/check-admin`, {
        responseType: 'text',
        withCredentials: true,
        observe: 'response',
      })
      .pipe(retry(3), catchError(this.handleError));
  }
  public setAdmin() {
    this.isAdmin.next(true);
    // localStorage.setItem('isAdmin', 'true');
  }
  public setNotAdmin() {
    this.isAdmin.next(false);
    // localStorage.setItem('isAdmin', 'false');
  }
  public clearAdmin() {
    localStorage.removeItem('isAdmin');
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
