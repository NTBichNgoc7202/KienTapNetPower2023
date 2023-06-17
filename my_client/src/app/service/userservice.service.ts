import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';
import { IUser } from '../interface/users';
import { User } from '../models/users';
import { Connect } from './connect.service';
@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
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
  getUsers(): Observable<IUser[]> {
    return this._http
      .get<IUser[]>(`${this.baseUrl}/users`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  getUserInfo(id: any): Observable<any> {
    return this._http
      .get<User>(`${this.baseUrl}/users/${id}`, this.options)
      .pipe(
        map((res) => {
          return res as User;
        }),
        retry(2),
        catchError(this.handleError)
      );
  }

  postUserInfo(c: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    };
    return this._http
      .post(`${this.baseUrl}/users`, JSON.stringify(c), requestOptions)
      .pipe(
        map((res) => res as any),
        retry(3),
        catchError(this.handleError)
      );
  }

  postUser(data: User) {
    return this._http.post(`${this.baseUrl}/users/regis`, data, this.options);
  }

  updateUser(c: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    };
    return this._http
      .put(`${this.baseUrl}/users/`, JSON.stringify(c), requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteUser(id: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    };
    let tempRequestOptions: any = requestOptions;
    tempRequestOptions['body'] = { _id: id };
    return this._http
      .delete(`${this.baseUrl}/users/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  logUser(data?: User): Observable<any> {
    return this._http.post(`${this.baseUrl}/users/login`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
      }),
      responseType: 'text',
      withCredentials: true,
    });
  }
  logOutUser() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    return this._http.post(
      `${this.baseUrl}/users/logout`,
      {},
      {
        headers: headers,
        responseType: 'text',
        withCredentials: true,
      }
    );
  }
  getLoginCookies() {
    return this._http.get(`${this.baseUrl}/users/cookieLogin`, {
      responseType: 'json',
      withCredentials: true,
    });
  }
  checkIsLoggedIn(): Observable<any> {
    return this._http.get(`${this.baseUrl}/users/isLoggedIn`, {
      responseType: 'json',
      withCredentials: true,
    });
  }
  getUserByPhone(phone: any): Observable<User> {
    return this._http
      .get(`${this.baseUrl}/users/phone/${phone}`, this.options)
      .pipe(
        map((res) => <User>res),
        retry(2),
        catchError(this.handleError)
      );
  }
  getLocation(phone: any): Observable<any> {
    const options = {
      params: new HttpParams().set('phone', phone),
      withCredentials: true,
    };
    return this._http.get(`${this.baseUrl}/users/location`, options);
  }
  updateLocation(phone: any, locationData: any): Observable<any> {
    return this._http.put(
      `${this.baseUrl}/users/location`,
      {
        phone: phone,
        location: locationData,
      },
      this.options
    );
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
