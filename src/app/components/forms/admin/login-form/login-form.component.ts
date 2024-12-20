import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import {
  LoginFormActions,
  LoginFormInputs,
} from 'src/app/core/interfaces/form-inputs/login-form-inputs';
import { FormInputService } from 'src/app/core/services/form-inputs/form-input.service';
import { CommonModule } from '@angular/common';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { ELoginForm } from 'src/app/core/enums/login-form';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';

type FormInputData = {
  txtEmail: HTMLInputElement;
  txtPwd: HTMLInputElement;
  btnLogin: HTMLInputElement;
};

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  providers: [],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginFormComponent implements AfterViewInit, OnGenericComponent {
  @Input('keys') keys: string = '';
  AppUtilities: typeof AppUtilities = AppUtilities;
  loginForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });
  ids$!: Observable<MElementPair>;
  constructor(
    private fb: FormBuilder,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService
  ) {
    let icons = ['lock'];
    this._appConfig.addIcons(icons, '../assets/assets/feather');
  }
  private usernameEventListener() {
    const updateUsername = (value: string) => {
      const username$ = this.ids$.pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.get(ELoginForm.USERNAME) as HTMLInputElement)
      );
      username$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.username.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updateUsername(value),
        error: (err) => console.error(err.message),
      });
  }
  private passwordEventHandler() {
    const updatePassword = (value: string) => {
      const password$ = this.ids$.pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.get(ELoginForm.PASSWORD) as HTMLInputElement)
      );
      password$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.password.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updatePassword(value),
        error: (err) => console.error(err.message),
      });
  }
  ngAfterViewInit(): void {
    this.initIds();
  }
  initIds(): void {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(ELoginForm).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers() {
    this.usernameEventListener();
    this.passwordEventHandler();
  }
  onLoginClicked() {
    const submit$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.LOGIN_BUTTON))
    );
    const subscribe = () => {
      submit$.subscribe({
        next: (el) => this.domService.clickButton(el as HTMLInputElement),
        error: (err) => console.error(err),
      });
    };
    this.loginForm.valid ? subscribe() : this.loginForm.markAllAsTouched();
  }
  openAdmissionPage(event: MouseEvent) {
    const admissionLink$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.ADMISSION_LINK))
    );
    admissionLink$.subscribe({
      next: (el) => this.domService.clickAnchorHref(el as HTMLAnchorElement),
      error: (err) => console.error(err),
    });
  }
  openForgotPasswordPage(event: MouseEvent) {
    const forgotPassword$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.FORGOT_LINK))
    );
    forgotPassword$.subscribe({
      next: (el) => this.domService.clickAnchorHref(el as HTMLAnchorElement),
      error: (err) => console.error(err),
    });
  }
  get username() {
    return this.loginForm.get('username') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
}
