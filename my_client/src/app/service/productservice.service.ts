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

const baseUrl = 'http://localhost:3000';
@Injectable({
  providedIn: 'root',
})
export class ProductserviceService {
  constructor(private _http: HttpClient) {}

  url_category = 'http://localhost:3000/products/category/';

  getProductList(): Observable<IProduct[]> {
    return this._http
      .get<IProduct[]>(`${baseUrl}/products`)
      .pipe(retry(3), catchError(this.handleError));
  }
  getProductListByCategory(id: any): Observable<IProduct[]> {
    return this._http
      .get<IProduct[]>(`${this.url_category}${id}`)
      .pipe(retry(3), catchError(this.handleError));
  }
  getProductListByTag(tag: any): Observable<IProduct[]> {
    return this._http
      .get<IProduct[]>(`${baseUrl}/products/tag/${tag}`)
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
    };
    return this._http
      .post(`${baseUrl}/products`, JSON.stringify(p), requestOptions)
      .pipe(map((res) => res as any),
        retry(3), catchError(this.handleError));
  }

  updateProduct(p: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=utf-8'
    );
    const requestOptions: Object = {
      headers: headers,
      responseType: 'text',
    };
    return this._http
      .put(`${baseUrl}/products/`, JSON.stringify(p), requestOptions)
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
    };
    let tempRequestOptions: any = requestOptions;
    tempRequestOptions['body'] = { _id: id };
    return this._http
      .delete(`${baseUrl}/products/`, tempRequestOptions)
      .pipe(retry(3), catchError(this.handleError));
  }

  getCategoryList(): Observable<ICategory[]> {
    return this._http
      .get<ICategory[]>(`${baseUrl}/products/categories`)
      .pipe(retry(3), catchError(this.handleError));
  }

  getProductInfo(id: any): Observable<any> {
    return this._http.get<Product>(`${baseUrl}/products/${id}`).pipe(
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
