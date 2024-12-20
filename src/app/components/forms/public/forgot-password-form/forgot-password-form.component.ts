import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import {
  ForgotPasswordFormActions,
  ForgotPasswordFormInputs,
} from 'src/app/core/interfaces/form-inputs/forgot-password-form-inputs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { NgxSonnerToaster, toast } from 'ngx-sonner';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { EForgotPasswordForm } from 'src/app/core/enums/forgot-password-form.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { GetCapchaImageSourcePipe } from 'src/app/core/pipes/forgot-password-pipes/forgot-password-pipes.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgxSonnerToaster,
    GetCapchaImageSourcePipe,
  ],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class ForgotPasswordFormComponent
  implements AfterViewInit, OnGenericComponent
{
  @Input('keys') keys: string = '';
  EForgotPasswordForm: typeof EForgotPasswordForm = EForgotPasswordForm;
  formGroup: FormGroup = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    secretQuestion: this.fb.control('', [Validators.required]),
    answer: this.fb.control('', [Validators.required]),
    capcha: this.fb.control('', [Validators.required]),
  });
  AppUtilities: typeof AppUtilities = AppUtilities;
  $secretQuestions!: Observable<HtmlSelectOption[]>;
  ids$!: Observable<MElementPair>;
  constructor(
    private fb: FormBuilder,
    private unsubscribe: UnsubscribeService,
    private domService: ElementDomManipulationService,
    private _appConfig: AppConfigService
  ) {
    const icons = ['refresh-ccw', 'chevron-left'];
    this._appConfig.addIcons(icons, '/assets/feather');
  }
  private usernameEventListener() {
    const updateUsername = (value: string) => {
      const username$ = this.ids$.pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.get(EForgotPasswordForm.USERNAME) as HTMLInputElement)
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
  private secretQuestionEventHandler() {
    const setSecretQuestion = (value: string, el: HTMLSelectElement) => {
      el.value = value;
      this.domService.dispatchSelectElementChangeEvent(el);
    };
    const secretQuestion$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) => el.get(EForgotPasswordForm.SECRET_QUESTION) as HTMLSelectElement
      )
    );
    const updateSecretQuestion = (value: string) => {
      secretQuestion$.subscribe({
        next: (selectElement) => setSecretQuestion(value, selectElement),
        error: (err) => console.error(err.message),
      });
    };
    const populateOptions = (questions: HTMLSelectElement) => {
      let questionsList = this.domService.getSelectOptionsAsArray(questions);
      if (!AppUtilities.isValueEmptyElement(questions)) {
        this.secretQuestion.setValue(questions.value);
      }
      this.$secretQuestions = new Observable((subscriber) => {
        subscriber.next(questionsList);
        subscriber.complete();
      });
    };
    this.secretQuestion.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updateSecretQuestion(value),
        error: (err) => console.error(err.message),
      });
    secretQuestion$.subscribe({
      next: (el) => populateOptions(el),
      error: (err) => console.error(err.message),
    });
  }
  private answerEventListener() {
    const updateAnswer = (value: string) => {
      const answer$ = this.ids$.pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.get(EForgotPasswordForm.ANSWER) as HTMLInputElement)
      );
      answer$.subscribe({
        next: (input) => (input.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.answer.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => updateAnswer(value),
      error: (err) => console.error(err.message),
    });
  }
  private capchaCodeEventHandler() {
    const updateCapcha = (value: string) => {
      const capcha$ = this.ids$.pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.get(EForgotPasswordForm.CAPCHA_TEXT) as HTMLInputElement)
      );
      capcha$.subscribe({
        next: (input) => (input.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.answer.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => updateCapcha(value),
      error: (err) => console.error(err.message),
    });
  }
  private hasInvalidCapchaError() {
    const capcha$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EForgotPasswordForm.INVALID_CAPCHA) as any)
    );
    capcha$.subscribe({
      next: (el) => {
        el.style.display === 'none' ? {} : toast.error(el.textContent);
      },
      error: (err) => console.error(err.message),
    });
  }
  ngAfterViewInit(): void {
    this.initIds();
    this.hasInvalidCapchaError();
  }
  initIds() {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(EForgotPasswordForm).filter((key) => isNaN(Number(key)))
          .length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers() {
    this.usernameEventListener();
    this.secretQuestionEventHandler();
    this.answerEventListener();
    this.capchaCodeEventHandler();
  }
  refreshCaptcha(event: MouseEvent) {
    const captcha$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EForgotPasswordForm.CAPCHA_BUTTON) as HTMLInputElement)
    );
    captcha$.subscribe({
      next: (input) => this.domService.clickButton(input),
      error: (err) => console.error(err.message),
    });
  }
  backToLogin(event: MouseEvent) {
    const backToLogin$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(EForgotPasswordForm.BACK_TO_LOGIN_BUTTON) as HTMLAnchorElement
      )
    );
    backToLogin$.subscribe({
      next: (anchor) => this.domService.clickAnchorHref(anchor),
      error: (err) => console.error(err.message),
    });
  }
  submitForm() {
    const submit$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(EForgotPasswordForm.SUBMIT_FORM_BUTTON) as HTMLInputElement
      )
    );
    const subscribe = () => {
      submit$.subscribe({
        next: (button) => this.domService.clickButton(button),
        error: (err) => console.error(err.message),
      });
    };
    this.formGroup.valid ? subscribe() : this.formGroup.markAllAsTouched();
  }
  get username() {
    return this.formGroup.get('username') as FormControl;
  }
  get secretQuestion() {
    return this.formGroup.get('secretQuestion') as FormControl;
  }
  get answer() {
    return this.formGroup.get('answer') as FormControl;
  }
  get capcha() {
    return this.formGroup.get('capcha') as FormControl;
  }
}
