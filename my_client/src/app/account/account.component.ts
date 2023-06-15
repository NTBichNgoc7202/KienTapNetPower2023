import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserserviceService } from '../service/userservice.service';
import { Router } from '@angular/router';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FavoriteService } from '../service/favorite.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/users';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  phone: string | null = null;
  userInfo: User = new User();
  constructor(
    private _userService: UserserviceService,
    private _activatedRoute: ActivatedRoute,
    private _shoppingCartService: ShoppingCartService,
    private _favoriteService: FavoriteService,
    private _toastr: ToastrService,
    private _router: Router
  ) { }
  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.phone = params.get('phone');
      if (this.phone != null) {
        this.isTrueCredentials();
      } else {
        this._router.navigate(['/login']);
      }
    });
  }
  isTrueCredentials() {
    this._userService.checkIsLoggedIn().subscribe({
      next: (data) => {
        if (data.message == 'Unauthorized') {
          this._router.navigate(['/login']);
          return;
        }
        if (data.user.phone != this.phone) {
          this._toastr.error(
            'You are not allowed to access this page with this account!'
          );
          this._router.navigate(['/']);
          return;
        }
        this.loadPersonalData(this.phone);
      },
    });
  }
  onLogoutClick() {
    this._userService.logOutUser().subscribe({
      next: (data) => {
        // Receive data (session) from server
        this._favoriteService.setTotalFavorites();
        this._shoppingCartService.setTotalItems();
        this._router.navigate(['/login']);
      },
      error: (err) => console.log(err),
    });
  }
  loadPersonalData(phone: any) {
    this._userService.getUserByPhone(phone).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.onChangeProfileClick()
      },
      error: (err) => console.log(err),
    });
  }
  getPhoneQueryParam() {
    return {
      phone: this.phone,
    };
  }
  getUniqueQueryParam() {
    return {
      unique_id: this.userInfo.unique_id,
    };
  }
  // This is another way to navigate to a component with outlet. But it is a stupid way.
  // <a [routerLink]="[{ outlets: { account: ['change-profile'] } }]" [queryParams]="getPhoneQueryParam()"></a>
  onChangeProfileClick() {
    this._router.navigate(
      [
        `account/${this.userInfo.phone}`,
        {
          outlets: {
            account: ['change-profile'],
          },
        },
      ],
      {
        queryParams: this.getPhoneQueryParam(),
        skipLocationChange: true,
      }
    );
  };
  onOrderHistoryClick() {
    this._router.navigate(
      [
        `account/${this.userInfo.phone}`,
        {
          outlets: {
            account: ['order-history'],
          },
        },
      ],
      {
        queryParams: this.getUniqueQueryParam(),
        skipLocationChange: true,
      }
    );
  };
  onEditPasswordClick() {
    this._router.navigate(
      [
        `account/${this.userInfo.phone}`,
        {
          outlets: {
            account: ['edit-password'],
          },
        },
      ],
      {
        queryParams: this.getPhoneQueryParam(),
        skipLocationChange: true,
      }
    );
  };
  onChangeAddressClick() {
    this._router.navigate(
      [
        `account/${this.userInfo.phone}`,
        {
          outlets: {
            account: ['change-address'],
          },
        },
      ],
      {
        queryParams: this.getPhoneQueryParam(),
        skipLocationChange: true,
      }
    );
  };
}
