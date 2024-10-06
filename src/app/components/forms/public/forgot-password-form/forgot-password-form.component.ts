import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import {
  ForgotPasswordFormActions,
  ForgotPasswordFormInputs,
} from 'src/app/core/interfaces/form-inputs/forgot-password-form-inputs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

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
  ],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss',
})
export class ForgotPasswordFormComponent implements OnInit {
  @Input('username-client-id') usernameClientId: string = '';
  @Input('question-client-id') questionClientId: string = '';
  @Input('answer-client-id') answerClientId: string = '';
  @Input('capcha-text-client-id') capchaTextClientId: string = '';
  @Input('capcha-image-client-id') capchaImageClientId: string = '';
  @Input('capcha-button-client-id') alternateCapchaClientId: string = '';
  @Input('back-to-login-link-client-id') backToLoginLinkClientId: string = '';
  @Input('submit-form-button-client-id') submitFormButtonClientId: string = '';
  @Input('invalid-capcha-client-id') invalidCapchaClientId: string = '';
  formGroup: FormGroup = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    secretQuestion: this.fb.control('', [Validators.required]),
    answer: this.fb.control('', [Validators.required]),
    capcha: this.fb.control('', [Validators.required]),
  });
  AppUtilities: typeof AppUtilities = AppUtilities;
  $secretQuestions = new BehaviorSubject<HtmlSelectOption[]>([]);
  formInputs$ = new BehaviorSubject<ForgotPasswordFormInputs>(
    {} as ForgotPasswordFormInputs
  );
  formActions$ = new BehaviorSubject<ForgotPasswordFormActions>(
    {} as ForgotPasswordFormActions
  );
  private destroyFormInputs$ = new Subject<void>();
  private subscriptions: Subscription[] = [];
  constructor(private fb: FormBuilder) {}
  private parseUsernameInput(username: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(username)) {
      this.username.setValue(username.value);
    }
    this.username.valueChanges.subscribe({
      next: (value) => {
        username.value = value;
      },
    });
  }
  private parseAnswerInput(answer: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(answer)) {
      this.answer.setValue(answer.value);
    }
    this.answer.valueChanges.subscribe({
      next: (value) => {
        answer.value = value;
      },
    });
  }
  private parseCapchaTextInput(capchaText: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(capchaText)) {
      this.capcha.setValue(capchaText.value);
    }
    this.capcha.valueChanges.subscribe({
      next: (value) => {
        capchaText.value = value;
      },
    });
  }
  private parseInvalidCaptchaValidator(invalidCaptcha: any) {
    if (invalidCaptcha.isvalid) return;
    toast.error(invalidCaptcha.textContent);
  }
  private parseSecretQuestionInput(questions: HTMLSelectElement) {
    let questionsList = AppUtilities.getSelectOptionsAsArray(questions);
    if (!AppUtilities.isValueEmptyElement(questions)) {
      this.secretQuestion.setValue(questions.value);
    }
    this.$secretQuestions.next(questionsList);
    this.secretQuestion.valueChanges.subscribe({
      next: (value) => {
        questions.value = value;
        let event = new Event('change', { bubbles: true });
        questions.dispatchEvent(event);
      },
    });
  }
  private isValidFormInputs(
    formInputs: ForgotPasswordFormInputs | ForgotPasswordFormActions
  ) {
    try {
      Object.keys(formInputs).forEach((key) => {
        let element = (formInputs as any)[key];
        if (Array.isArray(element)) {
          element.forEach((item, index) => {
            Object.keys(item).forEach((itemKey) => {
              if (!item[itemKey]) {
                throw new Error(
                  `Failed to find input ${itemKey} in array item ${index} of ${key}`
                );
              }
            });
          });
        } else {
          if (!element) throw Error(`Failed to find input ${key}`);
        }
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  private initFormInputs() {
    try {
      const formInputs: ForgotPasswordFormInputs = {
        username: document.getElementById(
          this.usernameClientId
        ) as HTMLInputElement,
        secretQuestion: document.getElementById(
          this.questionClientId
        ) as HTMLSelectElement,
        answer: document.getElementById(
          this.answerClientId
        ) as HTMLInputElement,
        capchaText: document.getElementById(
          this.capchaTextClientId
        ) as HTMLInputElement,
        capchaImage: document.getElementById(
          this.capchaImageClientId
        ) as HTMLImageElement,
        backToLoginLink: document.getElementById(
          this.backToLoginLinkClientId
        ) as HTMLAnchorElement,
        alternateCapcha: document.getElementById(
          this.alternateCapchaClientId
        ) as HTMLInputElement,
        invalidCapcha: document.getElementById(
          this.invalidCapchaClientId
        ) as HTMLElement,
      };
      if (this.isValidFormInputs(formInputs)) {
        this.formInputs$.next(formInputs);
      }
    } catch (error) {
      console.error(error);
    }
  }
  private initFormActions() {
    try {
      const formActions: ForgotPasswordFormActions = {
        submitFormButton: document.getElementById(
          this.submitFormButtonClientId
        ) as HTMLInputElement,
      };
      if (this.isValidFormInputs(formActions)) {
        this.formActions$.next(formActions);
      }
    } catch (err) {
      console.error(err);
    }
  }
  private parseFormInputs() {
    try {
      this.formInputs$.pipe(takeUntil(this.destroyFormInputs$)).subscribe({
        next: (formInputs) => {
          this.parseUsernameInput(formInputs.username);
          this.parseSecretQuestionInput(formInputs.secretQuestion);
          this.parseAnswerInput(formInputs.answer);
          this.parseCapchaTextInput(formInputs.capchaText);
          this.parseInvalidCaptchaValidator(formInputs.invalidCapcha);
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
  refreshCapcha(alternateCapcha: HTMLInputElement) {
    alternateCapcha.click();
  }
  backToLogin(backToLoginBtn: HTMLAnchorElement) {
    backToLoginBtn.click();
  }
  submitForm() {
    if (this.formGroup.valid) {
      this.subscriptions.push(
        this.formActions$.subscribe({
          next: (formActions) => {
            formActions.submitFormButton.click();
          },
        })
      );
    } else {
      this.formGroup.markAllAsTouched();
    }
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
