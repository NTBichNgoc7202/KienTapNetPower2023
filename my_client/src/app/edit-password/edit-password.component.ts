import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FgpwService } from '../service/fgpw.service';
import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class EditPasswordComponent implements OnInit {
  public resetPasswordForm: any;
  oldPassword: string = '';
  newPassword: string = '';
  reTypePassword: string = '';
  public phone: string | null = '';
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: UntypedFormBuilder,
    private _fgpwService: FgpwService,
    private _toastr: ToastrService,
  ) {}
  ngOnInit(): void {
    this._activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.phone = params.get('phone');
    });
    if (this.phone == null) {
      this._router.navigate(['/login']);
    }
    this.resetPasswordForm = this._formBuilder.group(
      {
        oldPass: ['', [Validators.required]],
        newPass: ['', [Validators.required]],
        reTypePass: ['', [Validators.required]],
      },
      { validators: this.passwordValidator }
    );
  }
  forgetPassword() {
    this._router.navigate(['forgotpw']);
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
  resetPassword(form: NgForm) {
    if (this.phone != null) {
      this._fgpwService
        .changePassword(this.phone, this.oldPassword, this.newPassword)
        .subscribe({
          next: (res) => {
            let resData: any = JSON.parse(res);
            if (resData.message === 'success') {
              this._toastr.success(
                `Bạn đã thay đổi mật khẩu thành công`,
                'ĐỔI MẬT KHẨU',
                {
                  timeOut: 100000,
                }
              );
              setTimeout(() => {
                this._router.navigate(['home-page']);
              }, 2000);
            } else {
              this._toastr.error('Mật khẩu cũ không chính xác', 'ĐỔI MẬT KHẨU');
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
}
