import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IRegisEmail } from '../interface/regisEmail';
import { RegisEmail } from '../models/regisEmail';
const baseUrl ="http://localhost:3000"
@Injectable({
  providedIn: 'root'
})
export class RegisemailService {

  constructor(private _http: HttpClient) { }
  getEmail():Observable<IRegisEmail[]> {
    return this._http.get<IRegisEmail[]>(`${baseUrl}/regisEmail`).pipe(
      retry(3),
     catchError(this.handleError)
    )
  }
  postEmail(data:RegisEmail){
    return this._http.post(`${baseUrl}/regisEmail`,data)
  } 
  handleError(err:HttpErrorResponse){
    return throwError(()=>new Error(err.message))
  }
}
