import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/products';
import { ProductserviceService } from '../service/productservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-product',
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent implements OnInit {
  @ViewChild('productImage') productImage!: ElementRef;

  product: Product = new Product();

  productList: any;

  errMess: string = '';

  constructor(
    private _service: ProductserviceService,
    private _toast: ToastrService,
    private router:Router

  ) {}

  ngOnInit(): void {
    this.getProducts();
  }
// thêm mới sp
  getProducts() {
    this._service.getProductList().subscribe({
      next: (data) => {
        this.productList = data;
        // console.log(this.productList);
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  onFileSelected(event: any, product: Product) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      product.image = reader.result!.toString();
    };
    setTimeout(() => {
      this.productImage.nativeElement.src = this.product.image;
    }, 1000);
    // reader.onloadend =this._handleReaderLoaded.bind(this);
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  submitData(form: NgForm) {
    this.product._id == ''; {
      this._service.postProduct(this.product).subscribe({
        next: (res) => {
          this._toast.success('Thêm thành công!', 'Thành công!');
          this.getProducts();
          this.onReset();
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    }
  }

  onReset(form?: NgForm) {
    if (form) {
      form.reset();
    }
    this.product = new Product();
  }

  onBack() {
    this.router.navigate(["admin"]);
  }
}
