import { Component } from '@angular/core';
import { AdminService } from './service/admin.service';
import { ChildrenOutletContexts, Router, RouterOutlet } from '@angular/router';
import { getSliderAnimation } from './app.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [getSliderAnimation()],
})
export class AppComponent {
  public isAdmin: boolean = false;
  constructor(
    private _adminService: AdminService,
    private router: Router,
    private contexts: ChildrenOutletContexts
  ) {
    this._adminService.isAdmin.subscribe({
      next: (res) => {
        this.isAdmin = res;
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }
  onCustomer() {
    this.router.navigate(['admin-customer']);
  }
  onOrder() {
    this.router.navigate(['admin-order']);
  }
  onProduct() {
    this.router.navigate(['admin']);
  }
  onDashboard() {
    this.router.navigate(['admin-dashboard']);
  }
  onFeedback() {
    this.router.navigate(['admin-feedback']);
  }
  onSignOut() {
    this._adminService.signOutAdmin().subscribe({
      next: (data) => {
        this.isAdmin = false;
        this.router.navigate(['/']);
      },
      error: (err) => console.log(err),
    });
  }
  prepareRoute(outlet: RouterOutlet) {
    // return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    return (
      outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animation']
    );
  }
  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData['state'];
  }
}
