import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/users';
import { FgpwService } from '../service/fgpw.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css'],
})
export class EditPasswordComponent implements OnInit {
  public resetPasswordForm: any;
  user: User = new User();
  newPassword: string = '';
  reTypePassword: string = '';
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _service: FgpwService,
    private _toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group(
      {
        pass: ['', [Validators.required]],
        newPass: ['', [Validators.required]],
        reTypePass: ['', [Validators.required]],
      },
      { validators: this.passwordValidator }
    );
  }
  resetPassword(form: NgForm) {
    this._service
      .changePassword(
        '643013866ab9241e4a1301ee',
        this.user.pass,
        this.newPassword
      )
      .subscribe((res) => {
        let resData: any = JSON.parse(res);
        if (resData.message === 'success') {
          this._toast.success(
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
          this._toast.error('Mật khẩu cũ không chính xác', 'ĐỔI MẬT KHẨU');
        }
      });
  }
  forgetPassword() {
    this.router.navigate(['forgotpw']);
  }
  get pass() {
    return this.resetPasswordForm.controls['pass'];
  }
  get newPass() {
    return this.resetPasswordForm.controls['newPass'];
  }
  get reTypePass() {
    return this.resetPasswordForm.controls['reTypePass'];
  }
  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const pass = control.get('newPass');
    const confirmPass = control.get('reTypePass');
    if ((pass && pass.pristine) || (confirmPass && confirmPass.pristine)) {
      return null;
    }
    return pass && confirmPass && pass.value !== confirmPass.value
      ? { misMatch: true }
      : null;
  }
}
