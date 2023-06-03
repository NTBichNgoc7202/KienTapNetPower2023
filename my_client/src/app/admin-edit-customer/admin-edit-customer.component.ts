import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { OrderService } from '../service/order.service';
import { User } from '../models/users';
import { UserserviceService } from '../service/userservice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-edit-customer',
  templateUrl: './admin-edit-customer.component.html',
  styleUrls: ['./admin-edit-customer.component.css']
})
export class AdminEditCustomerComponent {

user: User = new User();

errMess: string = '';

constructor(

  private _service: UserserviceService,
  private _toast: ToastrService,
  private router:Router,
  private activatedRoute: ActivatedRoute

) {}

 ngOnInit(): void {
  this.getUsers();
}

getUsers() {
  this.activatedRoute.paramMap.subscribe((param) => {
    let id = param.get('id');
    if(id != null) {
      this._service.getUserInfo(id).subscribe({
        next:(data:any) => {
          this.user = data
          setTimeout(() => {
            // this.productImage.nativeElement.src = this.product.image;
          },500)
        },
        error:(err) => {
          console.log(err);
        }
      })
    }
  })
}
onFileSelected(event: any, user: User) {
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    // user.image = reader.result!.toString();
  };
  setTimeout(() => {
    // this.productImage.nativeElement.src = this.product.image;
  }, 1000);
  // reader.onloadend =this._handleReaderLoaded.bind(this);
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}
editData(form: NgForm) {
  this.user._id != '' ;{
    this._service.updateUser(this.user).subscribe({
      next: (res) => {
        this._toast.success('Cập nhật người dùng thành công!', 'Thành công!');
        // this.onReset();
        // this.user._id = res._id;
        // this.user.unique_id = res.unique_id;
        // this.user.phone = res.phone;
        // this.user.pass = res.pass;
        // this.user.username = res.username;
        // this.user.useremail = res.useremail;

      },
      error: (err) => {
        alert(`Thất bại: ${err.message}`);
      }
    })
  }
}
onReset(form?: NgForm) {
  if (form) {
    form.reset();
  }
  this.user = new User();
}
onBack() {
  this.router.navigate(["admin-customer"]);
}
}
