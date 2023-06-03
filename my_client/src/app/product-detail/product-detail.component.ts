import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductserviceService } from '../service/productservice.service';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FavoriteService } from '../service/favorite.service';
import { Product } from '../models/products';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productInfo: Product = new Product();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _service: ProductserviceService,
    private _toast: ToastrService,
    private shoppingCartService: ShoppingCartService,
    private FavoriteService: FavoriteService

  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      let id = params.get('id');
      //Get product info -> Call API
      this.loadData(id);
    });
  }

  loadData(id: any) {
    this._service.getProductInfo(id).subscribe({
      next: (data) => {
        this.productInfo = data;
        this.productInfo.quantity = 1;
      },
      error: (err) => console.log(err),
    });
  }
  addtocart(p: any) {
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
  Notification() {
    this._toast.success('Thêm sản phẩm thành công');
  }
  FavNotification() {
    this._toast.success('Thêm vào yêu thích thành công');
  }
}
