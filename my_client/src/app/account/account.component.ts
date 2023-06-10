import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserserviceService } from '../service/userservice.service';
import { Router } from '@angular/router';
import { User } from '../models/users';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { FavoriteService } from '../service/favorite.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../service/order.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FgpwService } from '../service/fgpw.service';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  userInfo: User = new User();
  phone: string | null = null;
  orders: any = [];
  isOnProfile: boolean = true;
  isOnGetOrder: boolean = false;
  isOnEditPassword: boolean = false;
  // change password
  public resetPasswordForm: any;
  user: User = new User();
  newPassword: string = '';
  reTypePassword: string = '';
  constructor(
    private userService: UserserviceService,
    private orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private shoppingCartService: ShoppingCartService,
    private favoriteService: FavoriteService,
    private toastr: ToastrService,
    private router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _service: FgpwService
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
    // change password
    this.resetPasswordForm = this._formBuilder.group(
      {
        oldPass: ['', [Validators.required]],
        newPass: ['', [Validators.required]],
        reTypePass: ['', [Validators.required]],
      },
      { validators: this.passwordValidator }
    );
  }
  isTrueCredentials() {
    this.userService.checkIsLoggedIn().subscribe({
      next: (data) => {
        if (data.message == 'Unauthorized') {
          this.router.navigate(['/login']);
        }
        if (data.user.phone != this.phone) {
          this.toastr.error(
            'You are not allowed to access this page with this account!'
          );
          this.router.navigate(['/']);
        }
      },
    });
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
  onChangeSection(screenName: string) {
    this.isOnGetOrder = false;
    this.isOnProfile = false;
    this.isOnEditPassword = false;
    switch (screenName) {
      case 'profile':
        this.isOnProfile = true;
        break;
      case 'getOrder':
        this.isOnGetOrder = true;
        break;
      case 'editPassword':
        this.isOnEditPassword = true;
        break;
      default:
        break;
    }
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
  // change password
  resetPassword(form: NgForm) {
    this._service
      .changePassword(
        this.userInfo.phone,
        this.user.pass,
        this.newPassword
      )
      .subscribe({
        next: (res) => {
          let resData: any = JSON.parse(res);
          if (resData.message === 'success') {
            this.toastr.success(
              `Bạn đã thay đổi mật khẩu thành công`,
              'ĐỔI MẬT KHẨU',
              {
                timeOut: 100000,
              }
            );
            setTimeout(() => {
              this.router.navigate(['home-page']);
            }, 2000);
          } else {
            this.toastr.error('Mật khẩu cũ không chính xác', 'ĐỔI MẬT KHẨU');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  forgetPassword() {
    this.router.navigate(['forgotpw']);
  }
  get oldPass() {
    return this.resetPasswordForm.controls['oldPass'];
  }
  get newPass() {
    return this.resetPasswordForm.controls['newPass'];
  }
  get reTypePass() {
    return this.resetPasswordForm.controls['reTypePass'];
  }
  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const newPass = control.get('newPass');
    const confirmPass = control.get('reTypePass');
    if (
      (newPass && newPass.pristine) ||
      (confirmPass && confirmPass.pristine)
    ) {
      return null;
    }
    return newPass && confirmPass && newPass.value !== confirmPass.value
      ? { misMatch: true }
      : null;
  }
}
