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
import { baseUrl, proxyCase } from './server-url';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private _http: HttpClient) {}
  options = {
    withCredentials: true,
  };
  getAllOrders(): Observable<any> {
    return this._http
      .get<any>(`${baseUrl}/orders`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  getOrderById(unique_id: any): Observable<any> {
    return this._http
      .get<any>(`${baseUrl}/orders/${unique_id}`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  postOrder(order: any): Observable<any> {
    return this._http
      .post<any>(`${baseUrl}/orders`, order, this.options)
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
      .delete(`${baseUrl}/orders/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
}
