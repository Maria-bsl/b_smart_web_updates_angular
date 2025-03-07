import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Subject } from 'rxjs';
import { CPassFormAspxInput } from 'src/app/core/interfaces/helpers/aspx-inputs/admin/c-pass-form-aspx-input';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { PasswordFieldComponent } from '../../../reusables/password-field/password-field.component';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';

@Component({
    selector: 'app-cpass-form',
    //imports: [TranslocoModule, ReactiveFormsModule],
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        MatSelectModule,
    ],
    templateUrl: './cpass-form.component.html',
    styleUrl: './cpass-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CPassFormComponent {}
// export class CPassFormComponent implements OnInit {
//   @Input() secretQuestionClientId: string = '';
//   @Input() answerTextFieldClientId: string = '';
//   @Input()
//   newPasswordTextFieldClientId: string = '';
//   @Input()
//   confirmPasswordTextFieldClientId: string = '';
//   @Input() capchaTextFieldClientId: string = '';
//   @Input() imageCapchaClientId: string = '';
//   @Input()
//   refreshCapchaButtonClientId: string = '';
//   @Input() cpassSubmitButton: string = '';
//   @ViewChild('capchaImage') capchaImage!: ElementRef<HTMLImageElement>;
//   public $formInputs = new BehaviorSubject<CPassFormAspxInput>(
//     {} as CPassFormAspxInput
//   );
//   public $secretQuestions = new BehaviorSubject<HtmlSelectOption[]>([]);
//   public cpassFormGroup!: FormGroup;
//   AppUtilities: typeof AppUtilities = AppUtilities;
//   constructor(private fb: FormBuilder) {}
//   private createCPassFormInputs() {
//     let formInputs = {
//       secretQuestion: document.getElementById(this.secretQuestionClientId),
//       answer: document.getElementById(this.answerTextFieldClientId),
//       newPassword: document.getElementById(this.newPasswordTextFieldClientId),
//       confirmPassword: document.getElementById(
//         this.confirmPasswordTextFieldClientId
//       ),
//       capcha: document.getElementById(this.capchaTextFieldClientId),
//       capchaImage: document.getElementById(this.imageCapchaClientId),
//       capchaButton: document.getElementById(this.refreshCapchaButtonClientId),
//       submitButton: document.getElementById(this.cpassSubmitButton),
//     } as CPassFormAspxInput;
//     this.$formInputs.next(formInputs);
//   }
//   private prepareFormData() {
//     this.$formInputs.subscribe({
//       next: (result) => {
//         this.createSecretQuestionsListFromSelect(result.secretQuestion);
//       },
//     });
//   }
//   private createSecretQuestionsListFromSelect(select: HTMLSelectElement) {
//     let selectOptions: HtmlSelectOption[] = [];
//     for (let i = 0; i < select.options.length; i++) {
//       let option = {
//         value: select.options[i]?.value,
//         text: select.options[i].text,
//       };
//       selectOptions.push(option);
//     }
//     this.$secretQuestions.next(selectOptions);
//   }
//   private buildPage() {
//     this.createCPassFormInputs();
//     this.prepareFormData();
//   }
//   private createCPassFormGroup() {
//     this.cpassFormGroup = this.fb.group({
//       secretQuestion: this.fb.control('', [Validators.required]),
//       answer: this.fb.control('', [Validators.required]),
//       newPassword: this.fb.control('', [
//         Validators.required,
//         Validators.pattern(AppUtilities.PASSWORD_REGEX),
//         AppUtilities.matchValidator('confirmPassword', true),
//       ]),
//       confirmPassword: this.fb.control('', [
//         Validators.required,
//         Validators.pattern(AppUtilities.PASSWORD_REGEX),
//         AppUtilities.matchValidator('newPassword'),
//       ]),
//       capcha: this.fb.control('', [Validators.required]),
//     });
//   }
//   private secretQuestionChanged() {
//     this.secretQuestion.valueChanges.subscribe({
//       next: (value) => {
//         this.$formInputs.subscribe({
//           next: (result) => {
//             result.secretQuestion.value = value;
//           },
//         });
//       },
//     });
//   }
//   private answerChanged() {
//     this.answer.valueChanges.subscribe({
//       next: (value) => {
//         this.$formInputs.subscribe({
//           next: (result) => {
//             result.answer.value = value;
//           },
//         });
//       },
//     });
//   }
//   private newPasswordChanged() {
//     this.newPassword.valueChanges.subscribe({
//       next: (value) => {
//         this.$formInputs.subscribe({
//           next: (result) => {
//             result.newPassword.value = value;
//           },
//         });
//       },
//     });
//   }
//   private confimPasswordChanged() {
//     this.confirmPassword.valueChanges.subscribe({
//       next: (value) => {
//         this.$formInputs.subscribe({
//           next: (result) => {
//             result.confirmPassword.value = value;
//           },
//         });
//       },
//     });
//   }
//   private capchaChanged() {
//     this.capcha.valueChanges.subscribe({
//       next: (value) => {
//         this.$formInputs.subscribe({
//           next: (result) => {
//             result.capcha.value = value;
//           },
//         });
//       },
//     });
//   }
//   ngOnInit(): void {
//     //throw new Error('Method not implemented.');
//     console.log('Init called');
//     this.buildPage();
//     this.createCPassFormGroup();
//     this.secretQuestionChanged();
//     this.answerChanged();
//     this.newPasswordChanged();
//     this.confimPasswordChanged();
//     this.capchaChanged();
//     this.$formInputs.subscribe({
//       next: (result) => {
//         result.capchaImage.addEventListener('change', () => {
//           console.log('capcha chcnged');
//         });
//       },
//     });
//   }
//   onSubmitForm(event: Event) {
//     setTimeout(() => {
//       event.preventDefault();
//       if (this.cpassFormGroup.valid) {
//         this.$formInputs.subscribe({
//           next: (result) => {
//             result.submitButton.click();
//           },
//         });
//       } else {
//         this.cpassFormGroup.markAllAsTouched();
//       }
//     }, 100);
//   }
//   refreshCapcha() {
//     this.$formInputs.subscribe({
//       next: (result) => {
//         result.capchaButton.click();
//       },
//     });
//   }
//   resetCPassFormGroup() {
//     this.cpassFormGroup.reset();
//   }
//   get secretQuestion() {
//     return this.cpassFormGroup?.get('secretQuestion') as FormControl;
//   }
//   get answer() {
//     return this.cpassFormGroup?.get('answer') as FormControl;
//   }
//   get newPassword() {
//     return this.cpassFormGroup?.get('newPassword') as FormControl;
//   }
//   get confirmPassword() {
//     return this.cpassFormGroup?.get('confirmPassword') as FormControl;
//   }
//   get capcha() {
//     return this.cpassFormGroup?.get('capcha') as FormControl;
//   }
// }
