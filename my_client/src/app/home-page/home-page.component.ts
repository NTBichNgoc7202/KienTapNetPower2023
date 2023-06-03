import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { Product } from '../models/products';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ProductserviceService } from '../service/productservice.service';
import { BlogService } from '../service/blog.service';
import { Blog } from '../models/blog';
import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  products: any;
  categories: any;
  errMess: string = '';
  blog: Blog = new Blog();
  blogList: any;
  productList: any;

  constructor(
    private _service: ProductserviceService,
    private shoppingCartService: ShoppingCartService,
    private _toast: ToastrService,
    private _router: Router,
    private _blogService: BlogService,
    private FavoriteService: FavoriteService
  ) {
  }

  ngOnInit(): void {
    this._service.getCategoryList().subscribe((res: any) => {
      this.categories = res;
    });
    this.getBlogs();
    this.getProductCategory();
  }
  getBlogs() {
    this._blogService.getBlogList().subscribe({
      next: (data) => {
        this.blogList = data;
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  addtocart(p: any) {
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
        this.favoriteNotification();
        this.FavoriteService.setTotalFavorites();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  Notification() {
    this._toast.success('Thêm vào giỏ hàng thành công');
  }
  favoriteNotification() {
    this._toast.success('Thêm vào danh sách yêu thích thành công');
  }
  onSelect(id: any) {
    this._router.navigate(['/product-detail', id]);
  }
  onSelectBlog(id: any) {
    this._router.navigate(['/blog-detail', id]);
  }

  getProductCategory() {
    this._service.getProductListByTag("bestseller").subscribe({
      next: (data) => {
        this.productList = data;
        // console.log(this.productList);
      },
      error: (err) => (this.errMess = err.message),
    });
  }
}
