import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../models/products';
import { ProductserviceService } from '../service/productservice.service';
import { AdminService } from '../service/admin.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  // @ViewChild('productImage') productImage!: ElementRef;

  product: Product = new Product();

  productList: any;

  errMess: string = '';

  changeIdToName(id: string) {
    switch (id) {
      case '01':
        return 'vòng tay';
      case '02':
        return 'dây chuyền';
      case '03':
        return 'hoa tai';
      case '04':
        return 'nhẫn';
      case '05':
        return 'charm';
      default:
        return '';
    }
  }
  constructor(
    private _service: ProductserviceService,
    private _adminService: AdminService,
    private _toast: ToastrService,
    private router: Router
  ) {
    this._adminService.checkIsAdmin().subscribe({
      next: (res: any) => {
        if (res === 'Authorized') {
          this.getProducts();
          this._adminService.setAdmin();
          return;
        }
        this._toast.error(
          'Bạn phải đăng nhập quản trị để vào trang này!',
          'Cảnh báo!'
        );
        setTimeout(() => {
          this.router.navigate(['login-as-admin']);
        }, 0);
      },
      error: this.handleError,
    });
  }

  ngOnInit(): void {}
  handleError = (err: HttpErrorResponse) => {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${err.error.message}`;
    } else {
      errorMessage = `Mã lỗi: ${err.status}, ` + `Thông báo: ${err.message}`;
    }
    console.log(errorMessage);
  };
  getProducts() {
    this._service.getProductList().subscribe({
      next: (data) => {
        this.productList = data;
        // console.log(this.productList);
      },
      error: (err) => (this.errMess = err.message),
    });
  }
  // onFileSelected(event: any, product: Product) {
  //   let file = event.target.files[0];
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     product.image = reader.result!.toString();
  //   };
  //   setTimeout(() => {
  //     this.productImage.nativeElement.src = this.product.image;
  //   }, 1000);
  //   // reader.onloadend =this._handleReaderLoaded.bind(this);
  //   reader.onerror = function (error) {
  //     console.log('Error: ', error);
  //   };
  // }

  submitData(form: NgForm) {
    if (this.product._id == '') {
      this._service.postProduct(this.product).subscribe({
        next: (res) => {
          this._toast.success('Thêm thành công!', 'Thành công!');
          this.getProducts();
          this.onReset();
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
    } else {
      this._service.updateProduct(this.product).subscribe({
        next: (res) => {
          this._toast.success('Cập nhật thành công!', 'Thành công!');
          this.onReset();
          this.getProducts();
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

  delete(id: any) {
    if (confirm('Bạn có muốn xóa không?') == true) {
      this._service.deleteProduct(id).subscribe({
        next: (res) => {
          this._toast.success('Xóa thành công!', 'Đã xóa!', {
            timeOut: 2000,
          });
          this.getProducts();
        },
        error: (err) => {
          alert(`Thất bại: ${err.message}`);
        },
      });
    }
  }

  onChooseToAddNew() {
    this.product = new Product();
    // this.productImage.nativeElement.src = '';
  }
  onAddNew() {
    this.router.navigate(['addProduct']);
  }
  onEdit(id: any) {
    this.router.navigate(['editProduct', id]);
  }
}
