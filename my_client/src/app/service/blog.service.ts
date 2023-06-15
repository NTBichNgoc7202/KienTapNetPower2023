import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IBlog } from '../interface/blog';
import { Blog } from '../models/blog';
import { baseUrl, proxyCase } from './server-url';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private _http: HttpClient) {}
  options = {
    withCredentials: true,
  };
  getBlogList(): Observable<IBlog[]> {
    return this._http
      .get<IBlog[]>(`${baseUrl}/blogs`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  postBlog(data: Blog) {
    return this._http.post(`${baseUrl}/blog`, data, this.options);
  }

  updateBlog(id: any, data: any) {
    return this._http.patch(`${baseUrl}/${id}`, data, this.options);
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }

  deleteBlog(id: string) {
    return this._http.delete(`${baseUrl}/${id}`, this.options);
  }

  getBlogInfo(id: any) {
    return this._http
      .get(`${baseUrl}/blogs/${id}`, this.options)
      .pipe(retry(2), catchError(this.handleError));
  }
}
