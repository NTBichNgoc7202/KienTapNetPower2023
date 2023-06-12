import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  imports: [CommonModule],
})
export class OrderHistoryComponent implements OnInit {
  orders: Array<any> = [];
  unique_id: string | null = '';
  constructor(private _orderService: OrderService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    ) {
      this._activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
        this.unique_id = params.get('unique_id');
      });
      if (this.unique_id == null) {
        this._router.navigate(['/login']);
      }
  }
  ngOnInit(): void {
    if(this.unique_id != null) {
      this.getOrderOfUser();
    }
  }
  getOrderOfUser() {
    this._orderService.getOrderById(this.unique_id).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => console.log(err),
    });
  }
}
