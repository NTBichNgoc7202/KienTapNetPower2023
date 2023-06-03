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
const baseUrl = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  public isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(private _http: HttpClient) {}
  getAdmin(): Observable<IAdmin[]> {
    return this._http
      .get<IAdmin[]>(`${baseUrl}/admin`)
      .pipe(retry(3), catchError(this.handleError));
  }
  logAdmin(data: Admin) {
    return this._http.post(`/login-admin`, data);
  }
  signOutAdmin(): Observable<any> {
    return this._http
      .post(`/signout-admin`, {})
      .pipe(retry(3), catchError(this.handleError));
  }
  checkIsAdmin() {
    return this._http
      .get(`/check-admin`, { responseType: 'text' })
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
