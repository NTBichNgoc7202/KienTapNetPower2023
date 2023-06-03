import { Admin } from './../models/admin';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent implements OnInit {
  public adForm: any;
  admin: Admin = new Admin();
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _service: AdminService,
    private _toast: ToastrService,
    private _router: Router
  ) {}

  ngOnInit(): void {

    this.adForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required]],
    });
  }
  loginAdmin(form: NgForm) {
    this._service.logAdmin(this.admin).subscribe((res) => {
      let resData = JSON.parse(JSON.stringify(res));
      if (resData.message === 'success') {
        this._toast.success('Đăng nhập quản trị thành công!', 'ĐĂNG NHẬP');
        
        setTimeout(() => {
          // window.location.replace('/admin');
          this._service.setAdmin();
          this._router.navigate(['/admin']);
        },0);
      }
      if (resData.message === 'unsuccess') {
        this._toast.error('Sai mật khẩu!', 'ĐĂNG NHẬP');
      }
      if (resData.message === 'fail') {
        this._toast.error('Email không phải email quản trị!', 'ĐĂNG NHẬP');
      }
    });
  }

  get email() {
    return this.adForm.controls['email'];
  }
  get pass() {
    return this.adForm.controls['pass'];
  }
}
