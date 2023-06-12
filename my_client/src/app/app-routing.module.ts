import { LoginAdminComponent } from './login-admin/login-admin.component';
import { ForgotpwComponent } from './forgotpw/forgotpw.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
import { BlogComponent } from './blog/blog.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsComponent } from './products/products.component';
import { RegisComponent } from './regis/regis.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { AdminComponent } from './admin/admin.component';
import { AdminAddProductComponent } from './admin-add-product/admin-add-product.component';
import { AdminEditProductComponent } from './admin-edit-product/admin-edit-product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { AdminCustomerComponent } from './admin-customer/admin-customer.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminFeedbackComponent } from './admin-feedback/admin-feedback.component';
import { AdminEditCustomerComponent } from './admin-edit-customer/admin-edit-customer.component';

const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  {
    path: 'home-page',
    component: HomePageComponent,
    data: { animation: 'isLeft', state: 'home-page' },
  },
  {
    path: 'products',
    component: ProductsComponent,
    data: { animation: 'isLeft', state: 'products' },
  },
  { path: 'products/:id', component: ProductsComponent },
  {
    path: 'aboutus',
    component: AboutusComponent,
    data: { state: 'aboutus' },
  },
  {
    path: 'blogs',
    component: BlogComponent,
    data: { animation: 'isRight', state: 'blogs' },
  },
  {
    path: 'contact',
    component: ContactComponent,
    data: { animation: 'isRight', state: 'contact' },
  },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'regis', component: RegisComponent },
  { path: 'forgotpw', component: ForgotpwComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'addProduct', component: AdminAddProductComponent },
  { path: 'editProduct/:id', component: AdminEditProductComponent },
  { path: 'login-as-admin', component: LoginAdminComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'blog-detail/:id', component: BlogDetailComponent },
  {
    path: 'account/:phone',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  { path: 'admin', component: AdminComponent },
  { path: 'admin-customer', component: AdminCustomerComponent },
  { path: 'editUser/:id', component: AdminEditCustomerComponent },
  { path: 'admin-order', component: AdminOrderComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'admin-product', component: AdminComponent },
  { path: 'admin-feedback', component: AdminFeedbackComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
