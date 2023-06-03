import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, Observable, retry, Subject, throwError, BehaviorSubject } from 'rxjs';
import { IProduct } from '../interface/productList';
import { Product } from '../models/products';
import { ICategory } from '../interface/category';
import { Favorite } from '../models/favorite';
import { IFavorite } from '../interface/favorite';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly api_url = 'http://localhost:3000';


  public totalFavorite: BehaviorSubject<number> = new BehaviorSubject<number>(0);;

  constructor(private _http: HttpClient) {}

  getFavorite(): Observable<IFavorite[]> {
    return this._http
      .get<IFavorite[]>(`/favorite`)
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
    };
    return this._http
      .post(`/favorite`, JSON.stringify(p), requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
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
    };
    return this._http
      .delete(`/favorite`, requestOptions)
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
    };
    return this._http
      .patch(`/favorite`, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  public getProductCount() {
    return this._http
      .get(`/favorite/count`)
      .pipe(retry(3), catchError(this.handleError));
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
