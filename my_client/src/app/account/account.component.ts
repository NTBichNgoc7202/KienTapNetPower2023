import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserserviceService } from '../service/userservice.service';
import { Router } from '@angular/router';
import { User } from '../models/users';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FavoriteService } from '../service/favorite.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  userInfo: User = new User();
  phone:string| null = null;
  orders: any = [];
  isOnProfile: boolean = true;
  isOnGetOrder: boolean = false;
  constructor(
    private userService: UserserviceService,
    private orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private favoriteService: FavoriteService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.phone = params.get('phone');
      if (this.phone != null) {
        this.isTrueCredentials();
        this.loadPersonalData(this.phone);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  isTrueCredentials() {
    this.userService.checkIsLoggedIn().subscribe({
      next: (data) => {
        if(data.message== "Unauthorized"){
          this.router.navigate(['/login']);
        }
        if(data.user.phone != this.phone) {
          this.toastr.error('You are not allowed to access this page with this account!');
          this.router.navigate(['/']);
        }
      }});
  }
  loadPersonalData(phone: any) {
    this.userService.getUserByPhone(phone).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.getOrderOfUser();
      },
      error: (err) => console.log(err),
    });
  }
  onGetOrderClick() {
    this.isOnGetOrder = true;
    this.isOnProfile = false;
  }
  onProfileClick() {
    this.isOnGetOrder = false;
    this.isOnProfile = true;
  }
  onLogoutClick() {
    this.userService.logOutUser().subscribe({
      next: (data) => {
        // Receive data (session) from server
        this.favoriteService.setTotalFavorites();
        this.shoppingCartService.setTotalItems();
        this.router.navigate(['/login']);
      },
      error: (err) => console.log(err),
    });
  }
  getOrderOfUser() {
    this.orderService.getOrderById(this.userInfo.unique_id).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => console.log(err),
    });
  }
}
