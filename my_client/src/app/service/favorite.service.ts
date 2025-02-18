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
import { IProduct } from '../interface/productList';
import { Product } from '../models/products';
import { ICategory } from '../interface/category';
import { Favorite } from '../models/favorite';
import { IFavorite } from '../interface/favorite';
import { Connect } from './connect.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  public totalFavorite: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
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
  getFavorite(): Observable<IFavorite[]> {
    return this._http
      .get<IFavorite[]>(`${this.baseUrl}/favorite`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  postProductToFavorite(p: Product) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    };
    return this._http
      .post(`${this.baseUrl}/favorite`, JSON.stringify(p), requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  deleteProductFromFavorite(id: string) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      body: {
        _id: id,
      },
      withCredentials: true,
    };
    return this._http
      .delete(`${this.baseUrl}/favorite`, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  emptyFavorite() {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
      withCredentials: true,
    };
    return this._http
      .patch(`${this.baseUrl}/favorite`, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  public getProductCount() {
    return this._http
      .get(`${this.baseUrl}/favorite/count`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
  public setTotalFavorites() {
    this.getProductCount().subscribe({
      next: (res: any) => {
        this.totalFavorite.next(res);
      },
      error: (err: any) => {
        console.log(err.message);
      },
    });
  }
}
