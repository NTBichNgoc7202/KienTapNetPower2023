import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  catchError,
  Observable,
  retry,
  Subject,
  throwError,
  BehaviorSubject,
} from 'rxjs';
import { Connect } from './connect.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
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
  getAllOrders(): Observable<any> {
    return this._http
      .get<any>(`${this.baseUrl}/orders`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  getOrderById(unique_id: any): Observable<any> {
    return this._http
      .get<any>(`${this.baseUrl}/orders/${unique_id}`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  postOrder(order: any): Observable<any> {
    return this._http
      .post<any>(`${this.baseUrl}/orders`, order, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
  deleteOrder(id: string): Observable<any> {
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
      .delete(`${this.baseUrl}/orders/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
}
