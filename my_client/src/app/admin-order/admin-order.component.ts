import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../service/order.service';
import { AdminService } from '../service/admin.service';
// import { User } from '../models/users';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css'],
})
export class AdminOrderComponent {
  orders: any = [];

  constructor(
    private orderService: OrderService,
    private _adminService: AdminService,
    private _toast: ToastrService,
    private router: Router
  ) {
    this._adminService.checkIsAdmin().subscribe({
      next: (res: any) => {
        if (res.body === 'Authorized') {
          this.getOrders();
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
  getOrders() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => console.log(err),
    });
  }

  delete(id: any) {
    if (confirm('Bạn có muốn xóa không?') == true) {
      this.orderService.deleteOrder(id).subscribe({
        next: (res) => {
          this._toast.success('Xóa thành công!', 'Đã xóa!', {
            timeOut: 2000,
          });
          this.getOrders();
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    }
  }
}
