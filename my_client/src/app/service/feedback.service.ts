import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError, map } from 'rxjs';
import { Feedback } from '../models/feedback';
import { IFeedback } from './../interface/feedback';
import { Connect } from './connect.service';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
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
  getFeedback(): Observable<IFeedback[]> {
    return this._http
      .get<IFeedback[]>(`${this.baseUrl}/feedback`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteFeedback(id: string): Observable<any> {
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
      .delete(`${this.baseUrl}/feedback/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  postFeedback(data: Feedback) {
    return this._http.post(`${this.baseUrl}/feedback`, data, this.options);
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
