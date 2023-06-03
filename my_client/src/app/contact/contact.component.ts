import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, Validators } from '@angular/forms';
import { Feedback } from '../models/feedback';
import { FeedbackService } from '../service/feedback.service';
import { customValidator } from '../Validators/check.validator';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  public fbForm: any;
  feedback: Feedback=new Feedback();
  constructor(private _formBuilder: UntypedFormBuilder, private _service: FeedbackService,private _toast:ToastrService) { }

  ngOnInit(): void {
    this.fbForm = this._formBuilder.group({
      username:['',[Validators.required,Validators.minLength(2),customValidator( /\@|\#|\%|\$|\^|\&/g)]],
      useremail:['',[Validators.required,Validators.email]],
     usermessage:['', [Validators.required,Validators.minLength(10)]]
     })
  }
  sendFeedback(form:NgForm){
    this._service.postFeedback(this.feedback).subscribe(res=>{
   let resData=JSON.parse(JSON.stringify(res));       
   if(resData.message==="success")
   {
   this._toast.success("Gửi feedback thành công!","GỬI FEEDBACK")
    setTimeout(function() {window.location.replace("/home-page")},2000);
   }
   else
   {
      alert("Fail")
   }
 })
}
  get username() {
    return this.fbForm.controls['username']
  }
  get useremail() {
    return this.fbForm.controls['useremail']
  } 
  get usermessage() {
    return this.fbForm.controls['usermessage']
  } 
}
