import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/products';
import { ProductserviceService } from '../service/productservice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-edit-product',
  templateUrl: './admin-edit-product.component.html',
  styleUrls: ['./admin-edit-product.component.css'],
})
export class AdminEditProductComponent {
  @ViewChild('productImage') productImage!: ElementRef;

  product: Product = new Product();

  productList: any;

  errMess: string = '';

  constructor(
    private _service: ProductserviceService,
    private _toast: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }
  getProduct() {
    this.activatedRoute.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) {
        this._service.getProductInfo(id).subscribe({
          next: (data: any) => {
            this.product = data;
            setTimeout(() => {
              this.productImage.nativeElement.src = this.product.image;
            }, 500);
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
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
  editData(form: NgForm) {
    this.product._id != '';
    this._service.updateProduct(this.product).subscribe({
      next: (res) => {
        console.log(res)
        this._toast.success('Cập nhật sản phẩm thành công!', 'Thành công!');
        // this.onReset();
        // this.product._id = res._id;
        // this.product.name = res.name;
        // this.product.price = res.price;
        // this.product.categoryId = res.categoryId;
        // this.product.image = res.image;
        // this.productImage.nativeElement.src = res.image;
        // this.product.note = res.note;
      },
      error: (err) => {
        alert(`Thất bại: ${err.message}`);
      },
    });
  }

  onReset(form?: NgForm) {
    if (form) {
      form.reset();
    }
    this.product = new Product();
  }
  onBack() {
    this.router.navigate(['admin']);
  }
}
