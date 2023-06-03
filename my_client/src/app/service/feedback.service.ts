import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError,map } from 'rxjs';
import { Feedback } from '../models/feedback';
import { IFeedback } from './../interface/feedback';



const baseUrl ="http://localhost:3000"
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private _http: HttpClient) {
   }
   getFeedback():Observable<IFeedback[]> {
    return this._http.get<IFeedback[]>(`${baseUrl}/feedback`).pipe(
      retry(3),
     catchError(this.handleError)
    )
  }

  deleteFeedback(id: string): Observable<any> {
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
      .delete(`${baseUrl}/feedback/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  postFeedback(data:Feedback){
    return this._http.post(`${baseUrl}/feedback`,data)
  }
   handleError(err:HttpErrorResponse){
   return throwError(()=>new Error(err.message))
 }
}
