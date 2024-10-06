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
import { BehaviorSubject, of, Subject, Subscription, takeUntil } from 'rxjs';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import {
  LoginFormActions,
  LoginFormInputs,
} from 'src/app/core/interfaces/form-inputs/login-form-inputs';
import { FormInputService } from 'src/app/core/services/form-inputs/form-input.service';
import { CommonModule } from '@angular/common';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() loginButtonClientId: string = '';
  @Input() usernameInputClientId: string = '';
  @Input() passwordInputClientId: string = '';
  @Input() admissionLinkClientId: string = '';
  @Input() forgotPasswordLinkClientId: string = '';
  @ViewChild('usernameInput') usernameInput!: ElementRef<HTMLInputElement>;
  AppUtilities: typeof AppUtilities = AppUtilities;
  loginForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });
  private destroyFormInputs$ = new Subject<void>();
  formInputs$ = new BehaviorSubject<LoginFormInputs>({} as LoginFormInputs);
  formActions$ = new BehaviorSubject<LoginFormActions>({} as LoginFormActions);
  private subscriptions: Subscription[] = [];
  constructor(
    private fb: FormBuilder,
    private formInputService: FormInputService
  ) {}
  private addUsernameFormControlEventListener() {
    const username = document.getElementById(
      this.usernameInputClientId
    ) as HTMLInputElement;
    if (!username) throw Error('Failed to find Username Input.');
    AppUtilities.updateInputValueFromFormControl(this.username, username);
  }
  private addPasswordFormControlEventListener() {
    const password = document.getElementById(
      this.passwordInputClientId
    ) as HTMLInputElement;
    if (!password) throw Error('Failed to find Password Input.');
    AppUtilities.updateInputValueFromFormControl(this.password, password);
  }
  private addLoginFormGroupEventListeners() {
    try {
      this.addUsernameFormControlEventListener();
      this.addPasswordFormControlEventListener();
    } catch (error) {
      console.error(error);
    }
  }
  private initFormInputs() {
    try {
      const formInputs: LoginFormInputs = {
        username: document.getElementById(
          this.usernameInputClientId
        ) as HTMLInputElement,
        password: document.getElementById(
          this.passwordInputClientId
        ) as HTMLInputElement,
      };
      if (this.formInputService.isValidFormInputs(formInputs)) {
        this.formInputs$.next(formInputs);
      }
    } catch (error) {
      console.error(error);
    }
  }
  private initFormActions() {
    try {
      const formActions: LoginFormActions = {
        forgotPassword: document.getElementById(
          this.forgotPasswordLinkClientId
        ) as HTMLAnchorElement,
        login: document.getElementById(
          this.loginButtonClientId
        ) as HTMLInputElement,
        signUpForAdmission: document.getElementById(
          this.admissionLinkClientId
        ) as HTMLAnchorElement,
      };
      if (this.formInputService.isValidFormInputs(formActions)) {
        this.formActions$.next(formActions);
      }
    } catch (error) {}
  }
  private parseFormInputs() {
    try {
      this.formInputs$.pipe(takeUntil(this.destroyFormInputs$)).subscribe({
        next: (formInputs) => {
          this.formInputService.parseHtmlInputToFormControl(
            formInputs.username,
            this.username
          );
          this.formInputService.parseHtmlInputToFormControl(
            formInputs.password,
            this.password
          );
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  ngOnInit(): void {
    this.initFormInputs();
    this.initFormActions();
    this.parseFormInputs();
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  matchHtmlElementToFormControl(
    event: any,
    control: FormControl,
    element: HTMLInputElement | HTMLSelectElement
  ) {
    this.formInputService.matchFormControlValueWithHtmlElementValue(
      control,
      element
    );
  }
  onLoginClicked() {
    if (this.loginForm.valid) {
      this.subscriptions.push(
        this.formActions$.subscribe({
          next: (formInputs) => {
            formInputs.login.click();
          },
        })
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  openAdmissionPage() {
    const link = document.getElementById(
      this.admissionLinkClientId
    ) as HTMLAnchorElement;
    link.click();
  }
  openForgotPasswordPage() {
    const link = document.getElementById(
      this.forgotPasswordLinkClientId
    ) as HTMLAnchorElement;
    link.click();
  }
  get username() {
    return this.loginForm.get('username') as FormControl;
  }
  get password() {
    return this.loginForm.get('password') as FormControl;
  }
}
