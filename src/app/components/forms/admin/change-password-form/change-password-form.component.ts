import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject } from 'rxjs';
import { ChangePasswordAspxInput } from 'src/app/core/interfaces/helpers/aspx-inputs/admin/change-password-aspx-input';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { PasswordFieldComponent } from '../../../reusables/password-field/password-field.component';
import { confirmPasswordValidator } from 'src/app/core/validators/custom-validators';

@Component({
    selector: 'app-change-password-form',
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        PasswordFieldComponent,
    ],
    templateUrl: './change-password-form.component.html',
    styleUrl: './change-password-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})
export class ChangePasswordFormComponent implements AfterViewInit, OnInit {
  @Input() passwordUpdateMessageClientId!: string;
  @Input() passwordExpiredMessageClientId!: string;
  @Input() currentPasswordClientId: string = '';
  @Input() newPasswordClientId: string = '';
  @Input() confirmPasswordClientId: string = '';
  @Input() changePasswordButtonClientId: string = '';
  @ViewChild('alertBanner') alertBanner!: ElementRef<HTMLDivElement>;
  changePasswordFormGroup!: FormGroup;
  $formInputs = new BehaviorSubject<ChangePasswordAspxInput>(
    {} as ChangePasswordAspxInput
  );
  AppUtilities: typeof AppUtilities = AppUtilities;
  constructor(private fb: FormBuilder) {}
  private createChangePasswordFormGroup() {
    this.changePasswordFormGroup = this.fb.group({
      currentPassword: this.fb.control('', [Validators.required]),
      newPassword: this.fb.control('', [
        Validators.required,
        Validators.pattern(AppUtilities.PASSWORD_REGEX),
        AppUtilities.matchValidator('confirmPassword', true),
      ]),
      confirmPassword: this.fb.control('', [
        Validators.required,
        Validators.pattern(AppUtilities.PASSWORD_REGEX),
        AppUtilities.matchValidator('newPassword'),
      ]),
    });
  }
  private createChangePasswordFormInputs() {
    let formInput = {
      labelExpired: document.getElementById(
        this.passwordExpiredMessageClientId
      ),
      labelLongTimeExpired: document.getElementById(
        this.passwordUpdateMessageClientId
      ),
      txtCurrent: document.getElementById(this.currentPasswordClientId),
      txtPass: document.getElementById(this.newPasswordClientId),
      txtConfirm: document.getElementById(this.confirmPasswordClientId),
      btnReg: document.getElementById(this.changePasswordButtonClientId),
    } as ChangePasswordAspxInput;
    this.$formInputs.next(formInput);
  }
  private currentPasswordChanged() {
    this.currentPassword.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (result) => {
            result.txtCurrent.value = value;
          },
        });
      },
    });
  }
  private newPasswordChanged() {
    this.newPassword.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (result) => {
            result.txtPass.value = value;
          },
        });
      },
    });
  }
  private confirmPasswordChanged() {
    this.confirmPassword.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (result) => {
            result.txtConfirm.value = value;
          },
        });
      },
    });
  }
  ngAfterViewInit(): void {
    // this.createChangePasswordFormInputs();
    // this.createChangePasswordFormGroup();
    // this.currentPasswordChanged();
    // this.newPasswordChanged();
    // this.confirmPasswordChanged();
  }
  ngOnInit(): void {
    this.createChangePasswordFormInputs();
    this.createChangePasswordFormGroup();
    this.currentPasswordChanged();
    this.newPasswordChanged();
    this.confirmPasswordChanged();
  }
  onChangePasswordClicked(event: Event) {
    setTimeout(() => {
      event.preventDefault();
      if (this.changePasswordFormGroup.valid) {
        this.$formInputs.subscribe({
          next: (result) => {
            result.btnReg.click();
          },
        });
      } else {
        this.changePasswordFormGroup.markAllAsTouched();
      }
    }, 100);
  }
  togglePasswordVisibility(element: HTMLInputElement) {
    let type = element.type === 'text' ? 'password' : 'text';
    element.type = type;
  }
  onChangePasswordReset() {
    this.changePasswordFormGroup.reset();
  }
  closeAlertBanner() {
    this.alertBanner.nativeElement.style.display = 'none';
  }
  get currentPassword() {
    return this.changePasswordFormGroup.get('currentPassword') as FormControl;
  }
  get newPassword() {
    return this.changePasswordFormGroup.get('newPassword') as FormControl;
  }
  get confirmPassword() {
    return this.changePasswordFormGroup.get('confirmPassword') as FormControl;
  }
}
