import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordPageComponent } from './pages/change-password-page/change-password-page.component';
import { LoginFormComponent } from './components/forms/admin/login-form/login-form.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'change',
    component: ChangePasswordPageComponent,
  },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import(
  //       './components/layouts/admin-navigation/admin-navigation.module'
  //     ).then((m) => m.AdminNavigationModule),
  // },
  // {
  //   path: 'main',
  //   loadChildren: () =>
  //     import(
  //       './components/layouts/main-navigation/main-navigation.module'
  //     ).then((m) => m.MainNavigationModule),
  // },
  // {
  //   path: '',
  //   redirectTo: 'default.aspx',
  //   pathMatch: 'full',
  // },
  // {
  //   path: '*',
  //   loadChildren: () =>
  //     import(
  //       './components/layouts/admin-navigation/admin-navigation.module'
  //     ).then((m) => m.AdminNavigationModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
