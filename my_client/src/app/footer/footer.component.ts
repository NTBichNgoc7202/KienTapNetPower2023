import { UntypedFormBuilder, NgForm, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { RegisemailService } from '../service/regisemail.service';
import { ToastrService } from 'ngx-toastr';
import { RegisEmail } from '../models/regisEmail';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public rgeForm: any;
  regisEmail:RegisEmail=new RegisEmail();
  constructor(private _formBuilder: UntypedFormBuilder,private _service:RegisemailService,private _toast:ToastrService) { }

  ngOnInit(): void {
    this.rgeForm = this._formBuilder.group({
      useremail: ['', [Validators.required, Validators.minLength(10), Validators.email]]

  })
  }
  pwUser(form:NgForm){  this._service.postEmail(this.regisEmail).subscribe(res=>{
    let resData=JSON.parse(JSON.stringify(res));       
    if(resData.message==="success")
    {
    this._toast.success("Đăng ký nhận thông tin mới nhất thành công!","ĐĂNG KÝ NHẬN THÔNG TIN")
      setTimeout(function() {window.location.reload();},2000);
    }
    else
    {
      this._toast.error("Email đã được đăng ký nhận thông tin!","ĐĂNG KÝ NHẬN THÔNG TIN")
    }
  })

} 
 get useremail(){
  return this.rgeForm.controls['useremail']
}
}
