import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  signal,
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
import {
  BehaviorSubject,
  finalize,
  interval,
  map,
  Observable,
  Subject,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { NgOtpInputModule } from 'ng-otp-input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { EOtpForm } from 'src/app/core/enums/otp-enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxDialogComponent } from '../../../dialogs/message-box-dialog/message-box-dialog.component';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { OtpFormPipe } from 'src/app/core/pipes/otp-form-pipe/otp-form.pipe';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { TranslateModule } from '@ngx-translate/core';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';

@Component({
  selector: 'app-otp-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    MatIconModule,
    MatButtonModule,
    OtpFormPipe,
    TranslateModule,
  ],
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: [inOutAnimation],
})
export class OtpFormComponent
  implements OnInit, AfterViewInit, OnGenericComponent
{
  @Input('keys') keys: string = '';
  @Input('countdownseconds') countdownSeconds = '10';
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
  otpCountdown$!: Observable<number>;
  s_showingCountdown = signal<number>(0);
  ids$!: Observable<MElementPair>;
  constructor(
    private fb: FormBuilder,
    private unsubscribe: UnsubscribeService,
    private domService: ElementDomManipulationService,
    private _appConfig: AppConfigService
  ) {
    this._appConfig.initLanguage();
    this.registerIcons();
  }
  private otpTextFieldEventHandler() {
    const updateOtpTextField = (value: string) => {
      const OtpTextField$ = this.ids$.pipe(
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
  private initCountdown() {
    const seconds = parseInt(this.countdownSeconds);
    if (isNaN(seconds)) {
      console.warn(
        `Countdown seconds ${this.countdownSeconds} is not a number. Countdown will not execute.`
      );
    } else {
      this.otpCountdown$ = ((durationInSeconds: number) => {
        return interval(1000).pipe(
          map((elapsed) => durationInSeconds - elapsed),
          takeWhile((remaining) => remaining >= 0)
        );
      })(seconds);
      this.otpCountdown$.subscribe({
        next: (remaining) => this.s_showingCountdown.set(remaining),
        complete: () => this.s_showingCountdown.set(0),
      });
    }
  }
  ngOnInit(): void {
    this.initCountdown();
  }
  ngAfterViewInit(): void {
    this.initIds();
  }
  registerIcons(): void {
    const icons = ['chevron-left'];
    this._appConfig.addIcons(icons, '/assets/feather');
  }
  initIds() {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(EOtpForm).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers() {
    this.otpTextFieldEventHandler();
  }
  /**
   * Otp form submission handler
   * @param event click event
   */
  submitForm(event: MouseEvent) {
    const submit$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EOtpForm.VERIFY_BUTTON) as HTMLInputElement)
    );
    const subscribe = () => {
      submit$.subscribe({
        next: (el) => this.domService.clickButton(el),
        error: (err) => console.error(err),
      });
    };
    const invalidForm = () => {
      this.formGroup.markAllAsTouched();
      this._appConfig
        .openMessageBox('defaults.warning', 'otpForm.errors.invalidFormMessage')
        .pipe(this.unsubscribe.takeUntilDestroy)
        .subscribe({
          next: (dialogRef) => {},
          error: (err) => console.error(err),
        });
    };
    this.formGroup.valid ? subscribe() : invalidForm();
  }
  /**
   * Clicks on resend otp code link
   * @param event click event
   */
  resendCodeLinkClicked(event: MouseEvent) {
    const resendCode$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EOtpForm.RESEND_CODE) as HTMLAnchorElement)
    );
    resendCode$.subscribe({
      next: (el) => this.domService.clickAnchorHref(el),
      error: (err) => console.error(err),
    });
  }
  /**
   * Clicks on the back home link
   * @param event click event
   */
  backHomeLinkClicked(event: MouseEvent) {
    const backHome$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EOtpForm.BACK_HOME) as HTMLAnchorElement)
    );
    backHome$.subscribe({
      next: (el) => this.domService.clickAnchorHref(el),
      error: (err) => console.error(err),
    });
  }
  get opt_code() {
    return this.formGroup.get('opt_code') as FormControl;
  }
}
