import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IBlog } from '../interface/blog';
import { Blog } from '../models/blog';

const baseUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})

export class BlogService {

  readonly api_url = 'http://localhost:3000'

  constructor(private _http: HttpClient) { }

  getBlogList(): Observable<IBlog[]> {
    return this._http.get<IBlog[]>(`${baseUrl}/blogs`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      )
  }

  postBlog(data: Blog) {
    return this._http.post(`${baseUrl}/blog`, data)
  }

  updateBlog(id: any, data: any) {
    return this._http.patch(`${baseUrl}/${id}`, data)
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message))
  }

  deleteBlog(id: string) {
    return this._http.delete(`${baseUrl}/${id}`)
  }

  getBlogInfo(id:any){
    return this._http.get(`${this.api_url}/blogs/${id}`).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }
}
