import { AfterViewInit, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from '../../components/forms/admin/login-form/login-form.component';

@Component({
    selector: 'app-login-page',
    imports: [
        MatCardModule,
        MatDividerModule,
        MatListModule,
        LoginPageComponent,
        LoginFormComponent,
        RouterModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  @Input('login-button-client-id') loginButtonClientId: string = '';
  @Input('username-input-client-id') usernameInputClientId: string = '';
  @Input('password-input-client-id') passwordInputClientId: string = '';
  @Input('forgot-password-client-id') forgotPasswordClientId: string = '';
  @Input('admission-link-client-id') admissionLinkClientId: string = '';
}
