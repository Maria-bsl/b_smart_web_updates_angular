import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { BehaviorSubject, map, Subject, takeUntil } from 'rxjs';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { EOtpForm } from 'src/app/core/enums/otp-enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxDialogComponent } from '../../../dialogs/message-box-dialog/message-box-dialog.component';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';

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
  encapsulation: ViewEncapsulation.Emulated,
})
export class OtpFormComponent implements OnInit, AfterViewInit {
  @Input('keys') otpFormKeys: string = '';
  @ViewChild('invalidOtpFormSubmit')
  invalidOtpFormSubmit!: ElementRef<HTMLDialogElement>;
  static OTP_MAX_LENGTH: number = 6;
  formGroup = this.fb.group({
    opt_code: this.fb.control<string>('', [
      Validators.required,
      Validators.minLength(OtpFormComponent.OTP_MAX_LENGTH),
    ]),
  });
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
    private unsubscribe: UnsubscribeService,
    private elementService: ElementDomManipulationService,
    private _appConfig: AppConfigService
  ) {
    const icons = ['chevron-left'];
    this._appConfig.addIcons(icons, '/assets/feather');
  }
  private otpTextFieldEventHandler() {
    const updateOtpTextField = (value: string) => {
      const OtpTextField$ = this.elementService.ids$.pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.get(EOtpForm.OTP_TEXTFIELD) as HTMLInputElement)
      );
      OtpTextField$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.opt_code.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updateOtpTextField(value),
        error: (err) => console.error(err.message),
      });
  }
  private attachEventHandlers() {
    this.otpTextFieldEventHandler();
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.elementService.parseDocumentKeys(
      this.otpFormKeys,
      Object.keys(EOtpForm).filter((key) => isNaN(Number(key))).length
    );
    this.attachEventHandlers();
  }
  otpFormSubmitted() {
    const submit$ = this.elementService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EOtpForm.VERIFY_BUTTON))
    );
    const subscribe = () => {
      submit$.subscribe({
        next: (el) => this.elementService.clickButton(el as HTMLInputElement),
        error: (err) => console.error(err),
      });
    };
    const invalidForm = () => {
      this.formGroup.markAllAsTouched();
      const dialogRef = this._appConfig.openMessageBox(
        'Warning',
        'Please enter the 6 digit code that has been sent to you.'
      );
    };
    this.formGroup.valid ? subscribe() : invalidForm();
  }
  resendCodeLinkClicked(event: MouseEvent) {
    const resendCode$ = this.elementService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EOtpForm.RESEND_CODE))
    );
    resendCode$.subscribe({
      next: (el) =>
        this.elementService.clickAnchorHref(el as HTMLAnchorElement),
      error: (err) => console.error(err),
    });
  }
  backHomeLinkClicked(event: MouseEvent) {
    const backHome$ = this.elementService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EOtpForm.BACK_HOME))
    );
    backHome$.subscribe({
      next: (el) =>
        this.elementService.clickAnchorHref(el as HTMLAnchorElement),
      error: (err) => console.error(err),
    });
  }
  get opt_code() {
    return this.formGroup.get('opt_code') as FormControl;
  }
}
