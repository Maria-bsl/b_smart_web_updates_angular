import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppModule } from './app/app.module';
import {
  bootstrapApplication,
  createApplication,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  provideRouter,
  RouterModule,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app/app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, isDevMode, NgZone } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginPageComponent } from './app/pages/login-page/login-page.component';
import { ChangePasswordPageComponent } from './app/pages/change-password-page/change-password-page.component';
import { createCustomElement, NgElementConstructor } from '@angular/elements';
import { DashboardPageComponent } from './app/pages/dashboard-page/dashboard-page.component';
import { CPassPageComponent } from './app/pages/c-pass-page/c-pass-page.component';
import { LoginPageBannersComponent } from './app/banners/login-page-banners/login-page-banners.component';
import { BlockUnblockUserFormComponent } from './app/components/forms/admin/block-unblock-user/block-unblock-user-form.component';
import { SchoolGroupsPageComponent } from './app/pages/school-groups-page/school-groups-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RegisterSchoolFormComponent } from './app/components/forms/admin/register-school-form/register-school-form.component';
import { ForgotPasswordFormComponent } from './app/components/forms/public/forgot-password-form/forgot-password-form.component';
import { UpdateSchoolInfoFormComponent } from './app/components/forms/admin/update-school-info-form/update-school-info-form.component';
import { AdmissionPageComponent } from './app/pages/admission-page/admission-page.component';
import { AdmissionFormComponent } from './app/components/forms/public/admission-form/admission-form.component';

function defineCustomElement(
  name: string,
  customComponent: NgElementConstructor<
    | LoginPageComponent
    | DashboardPageComponent
    | ChangePasswordPageComponent
    | CPassPageComponent
    | LoginPageBannersComponent
    | BlockUnblockUserFormComponent
    | SchoolGroupsPageComponent
    | RegisterSchoolFormComponent
    | ForgotPasswordFormComponent
    | UpdateSchoolInfoFormComponent
  >
) {
  if (!customElements.get(name)) {
    customElements.define(name, customComponent);
  }
}

(async () => {
  const app = await createApplication({
    providers: [
      importProvidersFrom([MatDialogModule]),
      provideAnimationsAsync(),
      provideHttpClient(),
      // provideTransloco({
      //   config: {
      //     //availableLangs: ['en', 'sw', 'ln', 'fr'],
      //     availableLangs: ['en'],
      //     defaultLang: 'en',
      //     // Remove this option if your application doesn't support changing language in runtime.
      //     reRenderOnLangChange: true,
      //     prodMode: !isDevMode(),
      //   },
      //   loader: TranslocoHttpLoader,
      // }),
    ],
  });

  defineCustomElement(
    'login-page',
    createCustomElement(LoginPageComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'dashboard-page',
    createCustomElement(DashboardPageComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'change-password-page',
    createCustomElement(ChangePasswordPageComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'c-pass',
    createCustomElement(CPassPageComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'login-page-banners',
    createCustomElement(LoginPageBannersComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'block-unblock-user',
    createCustomElement(BlockUnblockUserFormComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'school-groups-page',
    createCustomElement(SchoolGroupsPageComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'register-school-form',
    createCustomElement(RegisterSchoolFormComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'forgot-password-form',
    createCustomElement(ForgotPasswordFormComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'update-school-info-form',
    createCustomElement(UpdateSchoolInfoFormComponent, {
      injector: app.injector,
    })
  );

  defineCustomElement(
    'admission-page',
    createCustomElement(AdmissionPageComponent, { injector: app.injector })
  );

  defineCustomElement(
    'admission-form',
    createCustomElement(AdmissionFormComponent, { injector: app.injector })
  );
})();

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes, withViewTransitions()),
//     provideAnimationsAsync(),
//     provideHttpClient(),
//     provideTransloco({
//       config: {
//         //availableLangs: ['en', 'sw', 'ln', 'fr'],
//         availableLangs: ['en'],
//         defaultLang: 'en',
//         // Remove this option if your application doesn't support changing language in runtime.
//         reRenderOnLangChange: true,
//         prodMode: !isDevMode(),
//       },
//       loader: TranslocoHttpLoader,
//     }),
//   ],
// });
