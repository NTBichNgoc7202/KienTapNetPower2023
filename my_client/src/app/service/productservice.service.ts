import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, retry, throwError, map } from 'rxjs';
import { IProduct } from '../interface/productList';
import { Product } from '../models/products';
import { ICategory } from '../interface/category';
import { Connect } from './connect.service';
@Injectable({
  providedIn: 'root',
})
export class ProductserviceService {
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

  getProductList(): Observable<IProduct[]> {
    return this._http
      .get<IProduct[]>(`${this.baseUrl}/products`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  getProductListByCategory(id: any): Observable<IProduct[]> {
    return this._http
      .get<IProduct[]>(`${this.baseUrl}/products/category/${id}`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }
  getProductListByTag(tag: any): Observable<IProduct[]> {
    return this._http
      .get<IProduct[]>(`${this.baseUrl}/products/tag/${tag}`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  postProduct(p: any): Observable<any> {
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
      .post(`${this.baseUrl}/products`, JSON.stringify(p), requestOptions)
      .pipe(
        map((res) => res as any),
        retry(3),
        catchError(this.handleError)
      );
  }

  updateProduct(p: any): Observable<any> {
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
      .put(`${this.baseUrl}/products/`, JSON.stringify(p), requestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteProduct(id: string): Observable<any> {
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
      .delete(`${this.baseUrl}/products/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getCategoryList(): Observable<ICategory[]> {
    return this._http
      .get<ICategory[]>(`${this.baseUrl}/products/categories`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getProductInfo(id: any): Observable<any> {
    return this._http
      .get<Product>(`${this.baseUrl}/products/${id}`, this.options)
      .pipe(
        map((res) => {
          return res as Product;
        }),
        retry(2),
        catchError(this.handleError)
      );
  }
  handleError(err: HttpErrorResponse) {
    return throwError(() => new Error(err.message));
  }
}
