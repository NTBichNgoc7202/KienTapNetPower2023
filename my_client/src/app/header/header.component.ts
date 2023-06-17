import { Component } from '@angular/core';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { ProductserviceService } from '../service/productservice.service';
import { Router } from '@angular/router';
import { FavoriteService } from '../service/favorite.service';
import { UserserviceService } from '../service/userservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../styles.css'],
})
export class HeaderComponent {
  public totalItem: number = 0;
  public totalFavorite: number = 0;
  categories: any = [];
  constructor(
    private _shoppingCartService: ShoppingCartService,
    private _productService: ProductserviceService,
    private _favoriteService: FavoriteService,
    private _userService: UserserviceService,
    private router: Router,
  ) {
    this._shoppingCartService.totalItem.subscribe({
      next: (res) => {
        this.totalItem = res;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
    this._shoppingCartService.setTotalItems();
    this._favoriteService.totalFavorite.subscribe({
      next: (res) => {
        this.totalFavorite = res;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
    this._favoriteService.setTotalFavorites();
    this._productService.getCategoryList().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.log(err.message),
    });
  }
  goToCategory(id: any) {
    this.router.navigate(['products', id]);
  }
  goToProduct() {
    this.router.navigate(['products']);
  }
  goToAccount() {
    this._userService.checkIsLoggedIn().subscribe({
      next: (res) => {
        if (res.message === 'Unauthorized') {
          this.router.navigate(['login']);
          return;
        }
        this.router.navigate(['account', res.user.phone]);
      },
      error: (err) => {
        console.log(err.message);
        this.router.navigate(['login']);
      },
    });
  }
  // <a routerLink="/favorite" routerLinkActive="active"></a>
  goToFavorite() {
    this.router.navigate(['love']);
  }
  goToDashboard() {
    window.location.href = 'https://glowy-dashboard.web.app/dashboard';
  }
}
