import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
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
  filter,
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
import { CommonModule, PlatformLocation } from '@angular/common';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { ELoginForm } from 'src/app/core/enums/login-form';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { OnGenericComponent } from 'src/app/core/interfaces/on-generic-component';
import { GetCapchaImageSourcePipe } from 'src/app/core/pipes/forgot-password-pipes/forgot-password-pipes.pipe';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { ILanguage } from 'src/app/core/interfaces/helpers/languages/ilanguages';
import { MatRippleModule } from '@angular/material/core';

type LoginEventBody = {
  username: string;
  password: string;
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
    GetCapchaImageSourcePipe,
    NgxSonnerToaster,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    MatRippleModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  providers: [],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginFormComponent implements AfterViewInit, OnGenericComponent {
  @Input('keys') keys: string = '';
  AppUtilities: typeof AppUtilities = AppUtilities;
  ELoginForm: typeof ELoginForm = ELoginForm;
  language!: FormControl<string | null>;
  loginForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    captcha: this.fb.control('', []),
  });
  ids$!: Observable<MElementPair>;
  languages$: Observable<ILanguage[]> = of([
    { code: 'en', label: 'ENG', icon: 'gb' },
    { code: 'sw', label: 'SWA', icon: 'tz' },
  ]);
  @ViewChild('myNav') myNav!: ElementRef<HTMLDivElement>;
  passwordHasError = signal<boolean>(false);
  @Output('login') loginClicked: EventEmitter<LoginEventBody> =
    new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private languageService: LanguageService,
    @Inject(PlatformLocation) private platformLocation: PlatformLocation
  ) {
    this.init();
    this.registerIcons();
  }
  private init() {
    this.language = this.fb.control(
      'sw', //localStorage.getItem('currentLang') ?? 'en',
      []
    );
    this.languageService.initLanguages(
      ['en', 'sw'],
      this.language.value ?? 'en'
    );
    this.language.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => this.languageService.changeLanguage(value!),
        error: (e) => console.error(e),
      });
  }
  private usernameValueChanges() {
    const subscribe = (value: string) => {
      this.username$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.username.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private passwordValueChanges() {
    const subscribe = (value: string) => {
      this.password$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.password.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private captchaTextValueChanges() {
    const subscribe = (value: string) => {
      this.captchaText$.subscribe({
        next: (input) => input && (input.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.captcha.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private attachValueChanges() {
    this.usernameValueChanges();
    this.passwordValueChanges();
    this.captchaTextValueChanges();
  }
  private initUsername() {
    this.username$.subscribe({
      next: (input) => this.username.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initPassword() {
    this.password$.subscribe({
      next: (input) => this.password.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initCaptcha() {
    this.captchaText$.subscribe({
      next: (input) => input && this.captcha.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  /**
   * Checks the custom captcha validator
   * if visible will display error message
   */
  private hasInvalidCaptchaError() {
    this.invalidCaptcha$.subscribe({
      next: (el) => {
        //el && (el.style.display === 'none' ? toast.error(el.textContent) : {});
        if (el) {
          el.style.display === 'none' ? toast.error(el.textContent) : {};
          this.passwordHasError.set(true);
        }
      },
      error: (err) => console.error(err.message),
    });
  }
  private initFormControls() {
    this.initUsername();
    this.initPassword();
    this.initCaptcha();
  }
  ngAfterViewInit(): void {
    this.initIds();
    this.hasInvalidCaptchaError();
  }
  registerIcons(): void {
    let icons = ['lock', 'refresh-ccw'];
    this._appConfig.addIcons(icons, '../assets/assets/feather');
    icons = ['phone'];
    this._appConfig.addIcons(icons, '../assets/assets/icons');
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
    this.initFormControls();
    this.attachValueChanges();
  }
  onLoginClicked(event: MouseEvent) {
    if (this.loginForm.valid) {
      const body: LoginEventBody = {
        username: this.username.value,
        password: this.password.value,
      };
      this.loginClicked.emit(body);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  openAdmissionPage(event: MouseEvent) {
    this.admissionLink$.subscribe({
      next: (el) => this.domService.clickAnchorHref(el as HTMLAnchorElement),
      error: (err) => console.error(err),
    });
  }
  openForgotPasswordPage(event: MouseEvent) {
    this.forgotPassword$.subscribe({
      next: (el) => this.domService.clickAnchorHref(el as HTMLAnchorElement),
      error: (err) => console.error(err),
    });
  }
  refreshCaptcha(event: MouseEvent) {
    this.captchaButton$.subscribe({
      next: (input) => this.domService.clickButton(input),
      error: (err) => console.error(err.message),
    });
  }
  downloadMobileAppClicked(event: MouseEvent) {
    this.myNav.nativeElement.style.height = '100%';
  }
  closeMobileAppAdvert(event: MouseEvent) {
    this.myNav.nativeElement.style.height = '0%';
  }
  get username() {
    return this.loginForm.get('username') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
  get captcha() {
    return this.loginForm.get('captcha') as FormControl;
  }
  get captchaButton$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      filter(
        (el) =>
          el.get(ELoginForm.CAPTCHA_BUTTON) !== null &&
          el.get(ELoginForm.CAPTCHA_BUTTON) !== undefined
      ),
      map((el) => el.get(ELoginForm.CAPTCHA_BUTTON) as HTMLInputElement)
    );
  }
  get captchaText$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      filter(
        (el) =>
          el.get(ELoginForm.CAPTCHA_BUTTON) !== null &&
          el.get(ELoginForm.CAPTCHA_BUTTON) !== undefined
      ),
      map((el) => el.get(ELoginForm.CAPTCHA_TEXT) as HTMLInputElement)
    );
  }
  get password$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.PASSWORD) as HTMLInputElement)
    );
  }
  get username$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.USERNAME) as HTMLInputElement)
    );
  }
  get forgotPassword$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.FORGOT_LINK))
    );
  }
  get admissionLink$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.ADMISSION_LINK))
    );
  }
  get submit$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ELoginForm.LOGIN_BUTTON) as HTMLInputElement)
    );
  }
  get invalidCaptcha$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      filter(
        (el) =>
          el.get(ELoginForm.INVALID_CAPTCHA_MSG) !== null &&
          el.get(ELoginForm.INVALID_CAPTCHA_MSG) !== undefined
      ),
      map((el) => el.get(ELoginForm.INVALID_CAPTCHA_MSG) as any)
    );
  }
}
