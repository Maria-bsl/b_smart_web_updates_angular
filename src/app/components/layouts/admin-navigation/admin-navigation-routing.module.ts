import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-navigation.component').then(
        (c) => c.AdminNavigationComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../../pages/login-page/login-page.component').then(
            (c) => c.LoginPageComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminNavigationRoutingModule {}
