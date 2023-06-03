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


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly api_url = 'http://localhost:3000';
  constructor(private _http: HttpClient) {}
  getAllOrders(): Observable<any> {
    return this._http
      .get<any>(`/orders`)
      .pipe(retry(3), catchError(this.handleError));
  }
  getOrderById(unique_id: any): Observable<any> {
    return this._http
      .get<any>(`/orders/${unique_id}`)
      .pipe(retry(3), catchError(this.handleError));
  }
  postOrder(order: any): Observable<any> {
    return this._http
      .post<any>(`/orders`, order)
      .pipe(retry(3), catchError(this.handleError));
  };
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
    };
    let tempRequestOptions: any = requestOptions;
    tempRequestOptions['body'] = { _id: id };
    return this._http
      .delete(`/orders/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

}
