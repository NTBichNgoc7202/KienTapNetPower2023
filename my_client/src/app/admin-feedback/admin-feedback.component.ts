import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Feedback } from '../models/feedback';
import { FeedbackService } from '../service/feedback.service';
import { NgForm } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-admin-feedback',
  templateUrl: './admin-feedback.component.html',
  styleUrls: ['./admin-feedback.component.css']
})
export class AdminFeedbackComponent {
  feedbacks: any = [];
  constructor(
    private feedbackService: FeedbackService,
    private _adminService: AdminService,
    private _toast: ToastrService,
    private router: Router
  ) {
    this._adminService.checkIsAdmin().subscribe({
      next: (res: any) => {
        if (res === 'Authorized') {
          this.getFeedbacks();
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
  getFeedbacks() {
    this.feedbackService.getFeedback().subscribe({
      next: (data) => {
        this.feedbacks = data;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  delete(id: any) {
    if (confirm('Bạn có muốn xóa không?') == true) {
      this.feedbackService.deleteFeedback(id).subscribe({
        next: (res) => {
          this._toast.success('Xóa thành công!', 'Đã xóa!', {
            timeOut: 2000,
          });
          this.getFeedbacks();
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    }
  }

}
