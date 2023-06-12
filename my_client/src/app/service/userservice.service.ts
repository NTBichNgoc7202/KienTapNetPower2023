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
const baseUrl = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class UserserviceService {
  readonly api_url = 'http://localhost:3000';
  constructor(private _http: HttpClient) {}
  getUsers(): Observable<IUser[]> {
    return this._http
      .get<IUser[]>(`${baseUrl}/users`)
      .pipe(retry(3), catchError(this.handleError));
  }
  getUserInfo(id: any): Observable<any> {
    return this._http.get<User>(`${baseUrl}/users/${id}`).pipe(
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
    };
    return this._http
      .post(`${baseUrl}/users`, JSON.stringify(c), requestOptions)
      .pipe(
        map((res) => res as any),
        retry(3),
        catchError(this.handleError)
      );
  }

  postUser(data: User) {
    return this._http.post(`${baseUrl}/users/regis`, data);
  }

  updateUser(c: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .put(`${baseUrl}/users/`, JSON.stringify(c), requestOptions)
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
    };
    let tempRequestOptions: any = requestOptions;
    tempRequestOptions['body'] = { _id: id };
    return this._http
      .delete(`${baseUrl}/users/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  logUser(data?: User): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.post(`/userLogin`, data, requestOptions);
  }
  logOutUser() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http.post(`/logout`, requestOptions);
  }
  getLoginCookies() {
    return this._http.get(`/loginCookie`, { responseType: 'json' });
  }
  getUserByPhone(phone: any): Observable<User> {
    return this._http.get(`${this.api_url}/users/phone/${phone}`).pipe(
      map((res) => <User>res),
      retry(2),
      catchError(this.handleError)
    );
  }
  checkIsLoggedIn(): Observable<any> {
    return this._http.get(`/isLoggedIn`, { responseType: 'json' });
  }
  getLocation(phone: any): Observable<any> {
    const options = { params: new HttpParams().set('phone', phone) };
    return this._http.get(`${this.api_url}/users/location`,options);
  }
  updateLocation(phone: any, locationData: any): Observable<any> {
    return this._http.put(`${this.api_url}/users/location`, {
      phone: phone,
      location: locationData,
    });
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
