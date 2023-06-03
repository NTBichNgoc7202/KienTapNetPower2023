import {
  Component,
  ViewChildren,
  OnInit,
  AfterViewInit,
  QueryList,
  AfterContentInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from '../models/cart';
import { Product } from '../models/products';
import { ShoppingCartService } from '../service/shopping-cart.service';
import { UntypedFormBuilder, Validators, NgForm } from '@angular/forms';
import {
  customValidator,
  passwordValidator,
} from '../Validators/check.validator';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements AfterViewInit {
  @ViewChildren('singleprice') component!: QueryList<HTMLSpanElement>;
  public purchaseForm: any;
  cart: any = [];
  errMess: string = '';
  public grandTotal: number = 0;
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _shoppingCartService: ShoppingCartService,
    private _orderService: OrderService,
    private _toast: ToastrService,
    private _router: Router
  ) {
    this.getCarts();
  }
  ngOnInit(): void {
    this.purchaseForm = this._formBuilder.group(
      {
        phone: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern(/((09|03|07|08|05)+([0-9]{8})\b)/g),
          ],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            customValidator(/\@|\#|\%|\$|\^|\&/g),
          ],
        ],
        address: ['', [Validators.required, Validators.minLength(10)]],
        paymentMethod:['',Validators.required],

      },
      { validators: passwordValidator }
    );
  }
  ngAfterViewInit() {
    this?.component?.changes.subscribe((c) => {
      c.toArray().forEach((item: any) => {
        setTimeout(() => {
          this.grandTotal += Number(
            item.nativeElement.innerText
              .replace(/[^0-9.]/g, '')
              .replace(/(\.\d+)+/, '')
          );
        }, 0);
      });
    });
  }
  submitData(form: NgForm) {

  }
  getCarts() {
    this._shoppingCartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  changeQuantity(p: Product) {
    this._shoppingCartService.changeProductQuantity(p).subscribe({
      next: (res) => {
        // console.log((res));
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }
  increase(p: Product) {
    p.quantity += 1;
    this.changeQuantity(p);
    this.grandTotal += p.price;
  }

  decrease(p: Product) {
    if (p.quantity > 1) {
      p.quantity -= 1;
      this.changeQuantity(p);
      this.grandTotal -= p.price;
    }
  }

  delete(id: any) {
    if (confirm('Bạn có muốn xóa không?') == true) {
      this._shoppingCartService.deleteProductFromCart(id).subscribe({
        next: (res) => {
          this._shoppingCartService.setTotalItems();
          this._toast.success('Xóa thành công!', 'Đã xóa!', {
            timeOut: 2000,
          });
          this.getCarts();
        },
        error: (err) => {
          alert(err.message);
        },
      });
    }
  }
  onSelect(id: any) {
    this._router.navigate(['/product-detail', id]);
  }
  emptyCart() {
    if (confirm('Bạn có muốn xóa tất cả không?') == true) {
      this._shoppingCartService.emptyCart().subscribe({
        next: (res) => {
          this._shoppingCartService.setTotalItems();
          this._toast.success('Đã xóa tất cả!', 'Thông báo!', {
            timeOut: 2000,
          });
          this.getCarts();
          this.grandTotal = 0;
        },
        error: (err) => {
          alert(err.message);
        },
      });
    }
  }
  onPurchase(form: NgForm) {
    let formValue:any = form;
    let order = {
      username:formValue.username,
      phone:formValue.phone,
      address:formValue.address,
      payment:formValue.paymentMethod,
      products:this.cart,
    };
    this._orderService.postOrder(order).subscribe({
      next: (res) => {
        this._toast.success('Đặt hàng thành công');
        this.purchaseForm.reset()
        this._shoppingCartService.emptyCart().subscribe({
          next: (res) => {
            this._shoppingCartService.setTotalItems();
            this.getCarts();
            this.grandTotal = 0;
          },
          error: (err) => {
            alert(err.message);
          },
        });
      },
      error: (err) => console.log(err),
    });
  }
  get phone() {
    return this.purchaseForm.controls['phone'];
  }
  get username() {
    return this.purchaseForm.controls['username'];
  }
  get address() {
    return this.purchaseForm.controls['address'];
  }
  get transer() {
    return this.purchaseForm.controls['transer'];
  }
  get cashOnDelievery() {
    return this.purchaseForm.controls['cashOnDelievery'];
  }
}
