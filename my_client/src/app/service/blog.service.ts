import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { IBlog } from '../interface/blog';
import { Blog } from '../models/blog';
import { Connect } from './connect.service';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
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
  getBlogList(): Observable<IBlog[]> {
    return this._http
      .get<IBlog[]>(`${this.baseUrl}/blogs`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  postBlog(data: Blog) {
    return this._http.post(`${this.baseUrl}/blog`, data, this.options);
  }

  updateBlog(id: any, data: any) {
    return this._http.patch(`${this.baseUrl}/${id}`, data, this.options);
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }

  deleteBlog(id: string) {
    return this._http.delete(`${this.baseUrl}/${id}`, this.options);
  }

  getBlogInfo(id: any) {
    return this._http
      .get(`${this.baseUrl}/blogs/${id}`, this.options)
      .pipe(retry(2), catchError(this.handleError));
  }
}
