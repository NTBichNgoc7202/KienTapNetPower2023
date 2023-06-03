import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Fgpw } from '../models/fgpw';
import { FgpwService } from '../service/fgpw.service';

@Component({
  selector: 'app-forgotpw',
  templateUrl: './forgotpw.component.html',
  styleUrls: ['./forgotpw.component.css'],
})
export class ForgotpwComponent implements OnInit {
  public fgForm: any;
  fgpw: Fgpw = new Fgpw();
  newPassword: string = '';
  isSubmited: boolean = false;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _service: FgpwService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.fgForm = this._formBuilder.group({
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/g),
        ],
      ],
    });
  }
  pwUser(form: NgForm) {
    this._service.resetPassword(this.fgpw).subscribe((res) => {
      let resData = JSON.parse(JSON.stringify(res));
      this.newPassword = resData.newPassword;
      if (resData.message === 'success') {
        this.isSubmited = true;
        this._toast.success(
          `Đăng ký lấy lại mật khẩu thành công! \n Mật khẩu mới của bạn là ${resData.newPassword}`,
          'CẤP LẠI MẬT KHẨU',
          {
            timeOut: 100000,
          }
        );
        // setTimeout(function () {
        //   window.location.replace('/login');
        // }, 2000);
      } else {
        this._toast.error(
          'Không tìm thấy tài khoản đã đăng ký với số điện thoại trên',
          'CẤP LẠI MẬT KHẨU'
        );
      }
    });
  }
  get phone() {
    return this.fgForm.controls['phone'];
  }
}
