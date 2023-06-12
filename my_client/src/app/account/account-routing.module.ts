import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountComponent } from './account.component';
import { LocationComponent } from '../location/location.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    data: { title: 'Account' },
    children: [
      {
        path: 'change-profile',
        pathMatch: 'full',
        outlet: 'account',
        loadComponent: () =>
          import('../change-profile/change-profile.component').then(
            (m) => m.ChangeProfileComponent
          ),
      },
      {
        path: 'order-history',
        pathMatch: 'full',
        outlet: 'account',
        loadComponent: () =>
          import('../order-history/order-history.component').then(
            (m) => m.OrderHistoryComponent
          ),
      },
      {
        path: 'edit-password',
        pathMatch: 'full',
        outlet: 'account',
        loadComponent: () =>
          import('../edit-password/edit-password.component').then(
            (m) => m.EditPasswordComponent
          ),
      },
      {
        path: 'change-address',
        pathMatch: 'full',
        outlet: 'account',
        loadComponent: () =>
          import('../location/location.component').then(
            (m) => m.LocationComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
