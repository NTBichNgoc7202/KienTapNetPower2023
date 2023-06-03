import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  isHidden = true;
  constructor(private _toast: ToastrService) { }

  ngOnInit(): void {
  }
  onCheckout() {
    this._toast.success('Đặt hàng thành công');
  }
  onCoupon() {
    this._toast.success('Áp dụng mã thành công');
  }
}
