import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserserviceService } from '../service/userservice.service';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { User } from '../models/users';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-customer',
  templateUrl: './admin-customer.component.html',
  styleUrls: ['./admin-customer.component.css'],
})
export class AdminCustomerComponent {
  user: any = [];
  customerList: any;
  constructor(
    private customerService: UserserviceService,
    private _adminService: AdminService,
    private _toast: ToastrService,
    private router: Router
  ) {
    this._adminService.checkIsAdmin().subscribe({
      next: (res: any) => {
        if (res.body === 'Authorized') {
          this.getCustomers();
          this._adminService.setAdmin();
          return;
        }
        this._toast.error(
          'Bạn phải đăng nhập quản trị để vào trang này!',
          'Cảnh báo!'
        );
        setTimeout(() => {
          this.router.navigate(['login-as-admin']);
        }, 0);
      },
      error: (err) => console.log(err),
    });
  }
  getCustomers() {
    this.customerService.getUsers().subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  submitData(form: NgForm) {
    if (this.user._id == '') {
      this.customerService.postUserInfo(this.user).subscribe({
        next: (res) => {
          this._toast.success('Thêm thành công!', 'Thành công!');
          this.getCustomers();
          this.onReset();
          // this.product._id = res._id;
          // this.product.name = res.name;
          // this.product.price = res.price;
          // this.product.categoryId = res.categoryId;
          // this.product.image = res.image;
          // this.productImage.nativeElement.src = res.image;
          // this.product.note = res.note;
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    } else {
      this.customerService.updateUser(this.user).subscribe({
        next: (res) => {
          this._toast.success('Cập nhật thành công!', 'Thành công!');
          this.onReset();
          this.getCustomers();
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    }
  }
  delete(id: any) {
    if (confirm('Bạn có muốn xóa không?') == true) {
      this.customerService.deleteUser(id).subscribe({
        next: (res) => {
          this._toast.success('Xóa thành công!', 'Đã xóa!', {
            timeOut: 2000,
          });
          this.getCustomers();
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    }
  }
  onReset(form?: NgForm) {
    if (form) {
      form.reset();
    }
    this.user = new User();
  }

  onEdit(id: any) {
    this.router.navigate(['editUser', id]);
  }
}
