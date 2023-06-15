import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
// Angular Material Modules
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DefaultUrlSerializer, UrlSerializer } from '@angular/router';
// Custome Modules
// Components
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ForgotpwComponent } from './forgotpw/forgotpw.component';
import { RegisComponent } from './regis/regis.component';
import { BlogComponent } from './blog/blog.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AdminComponent } from './admin/admin.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { StickyNavModule } from 'ng2-sticky-nav';
import { ContactComponent } from './contact/contact.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { AdminAddProductComponent } from './admin-add-product/admin-add-product.component';
import { AdminEditProductComponent } from './admin-edit-product/admin-edit-product.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminCustomerComponent } from './admin-customer/admin-customer.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { AdminFeedbackComponent } from './admin-feedback/admin-feedback.component';
import { AdminEditCustomerComponent } from './admin-edit-customer/admin-edit-customer.component';
import { CustomUrlSerializer } from './CustomUrlSerializer';
import { CustomHttpInterceptor } from './CustomHttpInterceptor';


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    AboutusComponent,
    ForgotpwComponent,
    LoginComponent,
    RegisComponent,
    BlogComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    AdminComponent,
    LoginAdminComponent,
    ProductDetailComponent,
    BlogDetailComponent,
    ContactComponent,
    FavoriteComponent,
    AdminAddProductComponent,
    AdminEditProductComponent,
    AdminSidebarComponent,
    AdminCustomerComponent,
    AdminOrderComponent,
    AdminFeedbackComponent,
    AdminEditCustomerComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    FormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatFormFieldModule,
    // MatInputModule,
    // MatDatepickerModule,

    ReactiveFormsModule,
    Ng2SearchPipeModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      preventDuplicates: true,
    }),
    StickyNavModule,
    // Custome Modules
  ],
  providers: [
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
    { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
