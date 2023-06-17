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
import { Cart } from '../models/cart';
import { ICategory } from '../interface/category';
import { ICart } from '../interface/cart';
import { Connect } from './connect.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  public totalItem: BehaviorSubject<number> = new BehaviorSubject<number>(0);
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
  getCart(): Observable<ICart[]> {
    return this._http
      .get<ICart[]>(`${this.baseUrl}/carts`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  changeProductQuantity(p: any) {
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
      .put(
        `${this.baseUrl}/carts/product/quantity`,
        {
          _id: p._id,
          quantity: p.quantity,
        },
        requestOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  postProductToCart(p: Product): Observable<any> {
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
      .post(`${this.baseUrl}/carts`, JSON.stringify(p), requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }

  deleteProductFromCart(id: string) {
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
      .delete(`${this.baseUrl}/carts`, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  emptyCart() {
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
      .patch(`${this.baseUrl}/carts`, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  public getProductCount() {
    return this._http
      .get(`${this.baseUrl}/carts/count`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  public setTotalItems() {
    this.getProductCount().subscribe({
      next: (res: any) => {
        this.totalItem.next(res);
      },
      error: (err: any) => {
        console.log(err.message);
      },
    });
  }
}
