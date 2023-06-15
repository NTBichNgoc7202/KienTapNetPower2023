import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { CurrencyPipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../models/products';
import { ProductserviceService } from '../service/productservice.service';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FavoriteService } from '../service/favorite.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit {
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productList: any;
  originalProductList: any;
  errMess: string = '';
  searchText: any;
  search_content: boolean = true;
  tag: string = '';
  sortByPrice: string = '1';
  categories: any = [];

  // Paginartor
  startToShow: number = 0;
  limitToShow: number = 12;
  pageIndex: number = 0;
  pageSize: number = 12;
  length: number = 0;
  changePaginator($event: any) {
    this.startToShow = 12 * $event.pageIndex;
    this.limitToShow = 12 + this.startToShow;
  }
  constructor(
    private _service: ProductserviceService,
    private _toast: ToastrService,
    private _router: Router,
    private shoppingCartService: ShoppingCartService,
    private FavoriteService: FavoriteService,
    private activateRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {
    this._service.getCategoryList().subscribe({
      next: (data) => {
        this.categories = data;
        // console.log(this.categories)
      },
      error: (err) => (this.errMess = err.message),
    });
    this.activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) {
        this.getProductByCategory(id);
      } else {
        this.getProducts();
      }
    });
    /**
     * This events get called by all clicks on the page
     */
    this.renderer.listen('window', 'click', (e: Event) => {
      /**
       * Only run when toggleButton is not clicked
       * If we don't check this, all clicks (even on the toggle button) gets into this
       * section which in the result we might never see the menu open!
       * And the menu itself is checked here, and it's where we check just outside of
       * the menu and button the condition abbove must close the menu
       */
      if (
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.menu.nativeElement
      ) {
        this.leave();
      }
    });
  }
  ngOnit() {}
  searchKey: string = '';
  ngOnInit(): void {
    // Get Category List
    this._service.getCategoryList().subscribe({
      next: (data) => {
        this.categories = data;
        // console.log(this.categories)
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  Notification() {
    this._toast.success('Thêm vào giỏ hàng thành công');
  }
  FavNotification() {
    this._toast.success('Thêm vào yêu thích thành công');
  }
  getProducts() {
    this._service.getProductList().subscribe({
      next: (data) => {
        this.productList = data;
        this.originalProductList = data;
        this.length = this.productList.length;
        this.pageIndex = 0;
        // console.log(this.productList);
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  getProductByCategory(id: any) {
    this._service.getProductListByCategory(id).subscribe({
      next: (data) => {
        this.productList = data;
        this.length = this.productList.length;
        this.paginator.firstPage();
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  search() {
    this.search_content = false;
  }
  leave() {
    this.search_content = true;
  }

  addtocart(p: any) {
    this.Notification();
    p.quantity = 1;
    this.shoppingCartService.postProductToCart(p).subscribe({
      next: (data) => {
        this.Notification();
        this.shoppingCartService.setTotalItems();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addtofavorite(p: any) {
    this.FavoriteService.postProductToFavorite(p).subscribe({
      next: (data) => {
        this.FavNotification();
        this.FavoriteService.setTotalFavorites();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSelect(id: any) {
    this._router.navigate(['product-detail', id]);
  }
  descendantPrice() {
    this.productList.sort((a: any, b: any) => {
      if (Number(a.price) > Number(b.price)) {
        return -1;
      } else if (a.price < b.price) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  ascendantPrice() {
    this.productList.sort((a: any, b: any) => {
      if (Number(a.price) < Number(b.price)) {
        return -1;
      } else if (Number(a.price) > Number(b.price)) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  ascendentName() {
    this.productList.sort((a: any, b: any) => {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  descendantName() {
    this.productList.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return -1;
      } else if (a.name < b.name) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  onEditClick($event: any) {
    switch ($event.target.value) {
      case '1':
        this.ascendantPrice();
        break;
      case '-1':
        this.descendantPrice();
        break;
      case '2':
        this.ascendentName();
        break;
      case '-2':
        this.descendantName();
        break;
      default:
        this.productList = this.originalProductList;
        break;
    }
  }
  showAll() {
    this.productList = this.originalProductList;
    this.length = this.productList?.length;
    this.paginator.firstPage();
  }
  sortByTags(tag: string) {
    this.tag = tag;
    this.productList = this.originalProductList.filter(
      (x: any) => x.note == tag
    );
    this.length = this.productList.length;
    this.paginator.firstPage();
  }
}
