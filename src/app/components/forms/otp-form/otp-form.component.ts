import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  OtpFormActions,
  OtpFormInputs,
} from 'src/app/core/interfaces/form-inputs/opt-form-inputs';
import { FormInputService } from 'src/app/core/services/form-inputs/form-input.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss'],
})
export class OtpFormComponent implements OnInit {
  @Input('otp-control') otpControl: string = '';
  @Input('home-link') homeLink: string = '';
  @Input('resend-otp-link') resendOtpLink: string = '';
  @Input('submit-otp-button') submitOtpButton: string = '';
  private destroyFormInputs$ = new Subject<void>();
  static OTP_MAX_LENGTH: number = 6;
  formGroup = this.fb.group({
    opt_code: this.fb.control('', [
      //Validators.required,
      //Validators.maxLength(OtpFormComponent.OTP_MAX_LENGTH),
      //Validators.minLength(OtpFormComponent.OTP_MAX_LENGTH),
    ]),
  });
  formInputs$ = new BehaviorSubject<OtpFormInputs>({} as OtpFormInputs);
  formActions$ = new BehaviorSubject<OtpFormActions>({} as OtpFormActions);
  otpConfig = {
    allowNumbersOnly: true,
    length: OtpFormComponent.OTP_MAX_LENGTH,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };
  constructor(
    private fb: FormBuilder,
    private formInputService: FormInputService
  ) {}
  private initFormInputs() {
    const formInputs: OtpFormInputs = {
      otpControl: document.getElementById(this.otpControl) as HTMLInputElement,
    };
    if (this.formInputService.isValidFormInputs(formInputs)) {
      this.formInputs$.next(formInputs);
    }
  }
  private initFormActions() {
    const formActions: OtpFormActions = {
      homeLink: document.getElementById(this.homeLink) as HTMLAnchorElement,
      resendOtpLink: document.getElementById(
        this.resendOtpLink
      ) as HTMLAnchorElement,
      submitOtpButton: document.getElementById(
        this.submitOtpButton
      ) as HTMLInputElement,
    };
    if (this.formInputService.isValidFormInputs(formActions)) {
      this.formActions$.next(formActions);
    }
  }
  private parseFormInputs() {
    try {
      this.formInputs$.pipe(takeUntil(this.destroyFormInputs$)).subscribe({
        next: (formInputs) => {
          this.formInputService.parseHtmlInputToFormControl(
            formInputs.otpControl,
            this.opt_code
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
  otpFormSubmitted() {
    this.formActions$.pipe(takeUntil(this.destroyFormInputs$)).subscribe({
      next: (formActions) => {
        formActions.submitOtpButton.click();
      },
    });
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
  get opt_code() {
    return this.formGroup.get('opt_code') as FormControl;
  }
}
