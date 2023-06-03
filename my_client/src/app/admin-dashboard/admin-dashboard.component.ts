import { Component } from '@angular/core';

import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  constructor(
    private _adminService: AdminService,
    private _toast: ToastrService,
    private router: Router
  ) {
    this._adminService.checkIsAdmin().subscribe({
      next: (res: any) => {
        if (res === 'Authorized') {
          // this.getOrders();
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
}
