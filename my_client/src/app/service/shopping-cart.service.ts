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
import { Cart } from '../models/cart';
import { ICategory } from '../interface/category';
import { ICart } from '../interface/cart';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly api_url = 'http://localhost:3000';

  public totalItem: BehaviorSubject<number> = new BehaviorSubject<number>(0);;

  constructor(private _http: HttpClient) {}

  getCart(): Observable<ICart[]> {
    return this._http
      .get<ICart[]>(`/carts`)
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
    };
    return this._http
      .put(
        `/carts/product/quantity`,
        {
          _id: p._id,
          quantity: p.quantity,
        },
        requestOptions
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  postProductToCart(p: Product) : Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .post(`/carts`, JSON.stringify(p), requestOptions)
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
    };
    return this._http
      .delete(`/carts`, requestOptions)
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
    };
    return this._http
      .patch(`/carts`, requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }
  public getProductCount() {
    return this._http
      .get(`/carts/count`)
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
