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
import { Favorite } from '../models/favorite';
import { Product } from '../models/products';
import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements AfterViewInit {
  @ViewChildren('singleprice') component!: QueryList<HTMLSpanElement>;
  favorite: any = [];
  errMess: string = '';
  public grandTotal: number = 0;
  constructor(
    private _service: FavoriteService,
    private _toast: ToastrService,
    private _router: Router
  ) {
    this.getFavorites();
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

  getFavorites() {
    this._service.getFavorite().subscribe({
      next: (data) => {
        this.favorite = data;
      },
      error: (err) => (this.errMess = err.message),
    });
  }

  delete(id: any) {
    if (confirm('Bạn có muốn xóa không?') == true) {
      this._service.deleteProductFromFavorite(id).subscribe({
        next: (res) => {
          this._service.setTotalFavorites();
          this._toast.success('Xóa thành công!', 'Đã xóa!', {
            timeOut: 2000,
          });
          this.getFavorites();
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
  emptyFavorite() {
    if (confirm('Bạn có muốn xóa tất cả không?') == true) {
      this._service.emptyFavorite().subscribe({
        next: (res) => {
          this._service.setTotalFavorites();
          this._toast.success('Đã xóa tất cả!', 'Thông báo!', {
            timeOut: 2000,
          });
          this.getFavorites();
          this.grandTotal = 0;
        },
        error: (err) => {
          alert(err.message);
        },
      });
    }
  }
}
