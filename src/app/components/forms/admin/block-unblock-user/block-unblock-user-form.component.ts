import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { MatRadioModule } from '@angular/material/radio';
import { BehaviorSubject } from 'rxjs';
import { BlockUnblockUserAspxInput } from 'src/app/core/interfaces/helpers/aspx-inputs/admin/block-unblock-user-aspx-input';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BlockedStatus } from 'src/app/core/enums/blocked-status';
import { AutocompleteFilterExampleComponent } from '../../../reusables/autocomplete-filter-example/autocomplete-filter-example.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { UserTypes } from 'src/app/core/enums/user-type';
import { MatInput, MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-block-unblock-user',
  standalone: true,
  imports: [
    MatRadioModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    AutocompleteFilterExampleComponent,
    MatAutocompleteModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './block-unblock-user-form.component.html',
  styleUrl: './block-unblock-user-form.component.scss',
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockUnblockUserFormComponent implements OnInit {
  @Input('title') title: string = '';
  @Input('user-types-select') userTypesSelect: string = '';
  @Input('block-unblock-user-actions') blockUnblockUserAction: string = '';
  @Input('user-full-name') fullName: string = '';
  @Input('unblocked-users-select') unblockUsersSelect: string = '';
  @Input('blocked-users-select') blockedUsersSelect: string = '';
  @Input('reason-for-block') reasonForBlock: string = '';
  @Input('block-submit-button') blockSubmitButton: string = '';
  @Input('unblock-submit-button') unblockSubmitButton: string = '';
  $formInputs = new BehaviorSubject<BlockUnblockUserAspxInput>(
    {} as BlockUnblockUserAspxInput
  );
  $userTypes = new BehaviorSubject<HtmlSelectOption[]>([]);
  $actions = new BehaviorSubject<HtmlSelectOption[]>([]);
  $blockedUsers = new BehaviorSubject<HtmlSelectOption[]>([]);
  $unblockedUers = new BehaviorSubject<HtmlSelectOption[]>([]);
  $fullNamesList = new BehaviorSubject<HtmlSelectOption[]>([]);
  formGroup!: FormGroup;
  AppUtilities: typeof AppUtilities = AppUtilities;
  BlockedStatus: typeof BlockedStatus = BlockedStatus;
  UserTypes: typeof UserTypes = UserTypes;
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {}
  private initInputForms() {
    let formInputs = {
      userTypeSelect: document.getElementById(this.userTypesSelect),
      userActionSelect: document.getElementById(this.blockUnblockUserAction),
      fullNameSelect: document.getElementById(this.fullName),
      reasonForBlock: document.getElementById(this.reasonForBlock),
      unblockedUsers: document.getElementById(this.unblockUsersSelect),
      blockedUsers: document.getElementById(this.blockedUsersSelect),
      blockSubmitButton: document.getElementById(this.blockSubmitButton),
      unblockSubmitButton: document.getElementById(this.unblockSubmitButton),
    } as BlockUnblockUserAspxInput;
    this.$formInputs.next(formInputs);
  }
  private initFormGroup() {
    this.createFormGroup();
    this.parseFormInputs();
  }
  private parseFormInputs() {
    this.$formInputs.subscribe({
      next: (forms) => {
        this.prepareFormData();

        this.parseCheckUserType(forms.userTypeSelect);
        this.userTypeChanged();

        this.parseCheckAction(forms.userActionSelect);
        this.actionChanged();

        this.parseCheckBlockedUser(forms.blockedUsers);
        this.blockedUsersChanged();

        this.parseCheckedUnblockedUsers(forms.unblockedUsers);
        this.unblockedUsersChanged();

        this.parseCheckFullName(forms.fullNameSelect);
        this.fullNameChanged();

        this.parseReasonForBlock(forms.reasonForBlock);
        this.reasonChanged();
      },
    });
  }
  private parseCheckUserType(userType: HTMLSelectElement) {
    if (!userType) return;
    let value = userType.value;
    if (value) {
      this.userType.setValue(value);
    }
  }
  private parseCheckAction(actions: HTMLSelectElement) {
    if (!actions) return;
    let value = actions.value;
    if (value) {
      this.action.setValue(value);
    }
  }
  private parseCheckBlockedUser(blockedUsers: HTMLSelectElement) {
    if (!blockedUsers) return;
    let value = blockedUsers.value;
    if (value) {
      this.blockedUser.setValue(value);
    }
  }
  private parseCheckedUnblockedUsers(unblockedUsers: HTMLSelectElement) {
    if (!unblockedUsers) return;
    let value = unblockedUsers.value;
    if (value) {
      this.unblockedUser.setValue(value);
    }
  }
  private parseCheckFullName(fullNames: HTMLSelectElement) {
    if (!fullNames) return;
    let value = fullNames.value;
    if (value) {
      this.fullNameControl.setValue(value);
    }
  }
  private parseReasonForBlock(reason: HTMLInputElement) {
    if (!reason) return;
    let value = reason.value;
    if (value) {
      this.reason.setValue(value);
    }
  }
  private createFormGroup() {
    this.formGroup = this.fb.group({
      userType: this.fb.control('', [Validators.required]),
      action: this.fb.control('', [Validators.required]),
      blockedUser: this.fb.control('', [Validators.required]),
      unblockedUser: this.fb.control('', [Validators.required]),
      fullNameControl: this.fb.control('', [Validators.required]),
      reason: this.fb.control('', [Validators.required]),
    });
  }
  private prepareFormData() {
    this.$formInputs.subscribe({
      next: (result) => {
        let userTypes = AppUtilities.getSelectOptionsAsArray(
          result.userTypeSelect
        );
        this.$userTypes.next(userTypes);

        let actions = AppUtilities.getSelectOptionsAsArray(
          result.userActionSelect
        );
        this.$actions.next(actions);

        if (result.blockedUsers) {
          let blockedUsers = AppUtilities.getSelectOptionsAsArray(
            result.blockedUsers
          );
          this.$blockedUsers.next(blockedUsers);
        }

        if (result.unblockedUsers) {
          let unblockedUsers = AppUtilities.getSelectOptionsAsArray(
            result.unblockedUsers
          );
          this.$unblockedUers.next(unblockedUsers);
        }

        if (result.fullNameSelect) {
          let fullNames = AppUtilities.getSelectOptionsAsArray(
            result.fullNameSelect
          );
          this.$fullNamesList.next(fullNames);
        }
      },
    });
  }
  private userTypeChanged() {
    this.userType.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (forms) => {
            forms.userTypeSelect.value = value;
            let event = new Event('change', { bubbles: true });
            forms.userTypeSelect.dispatchEvent(event);
          },
        });
      },
    });
  }
  private actionChanged() {
    this.action.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (forms) => {
            forms.userActionSelect.value = value;
            let event = new Event('change', { bubbles: true });
            forms.userActionSelect.dispatchEvent(event);
          },
        });
      },
    });
  }
  private blockedUsersChanged() {
    this.blockedUser.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (forms) => {
            forms.blockedUsers.value = value;
            let event = new Event('change', { bubbles: true });
            forms.blockedUsers.dispatchEvent(event);
          },
        });
      },
    });
  }
  private unblockedUsersChanged() {
    this.unblockedUser.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (forms) => {
            forms.unblockedUsers.value = value;
            let event = new Event('change', { bubbles: true });
            forms.unblockedUsers.dispatchEvent(event);
          },
        });
      },
    });
  }
  private fullNameChanged() {
    this.fullNameControl.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (forms) => {
            forms.fullNameSelect.value = value;
            let event = new Event('change', { bubbles: true });
            forms.fullNameSelect.dispatchEvent(event);
          },
        });
      },
    });
  }
  private reasonChanged() {
    this.reason.valueChanges.subscribe({
      next: (value) => {
        this.$formInputs.subscribe({
          next: (forms) => {
            forms.reasonForBlock.value = value;
            //let event = new Event('change', { bubbles: true });
            //forms.reasonForBlock.dispatchEvent(event);
          },
        });
      },
    });
  }
  ngOnInit(): void {
    this.initInputForms();
    this.initFormGroup();
    //this.formGroupChanged();
  }
  resetFormGroup() {
    this.formGroup.reset();
  }
  submitForm() {
    this.$formInputs.subscribe({
      next: (forms) => {
        if (this.action.value === BlockedStatus.UNBLOCK) {
          forms.unblockSubmitButton.click();
        } else {
          forms.blockSubmitButton.click();
        }
      },
    });
  }
  get userType() {
    return this.formGroup.get('userType') as FormControl;
  }
  get action() {
    return this.formGroup.get('action') as FormControl;
  }
  get blockedUser() {
    return this.formGroup.get('blockedUser') as FormControl;
  }
  get unblockedUser() {
    return this.formGroup.get('unblockedUser') as FormControl;
  }
  get fullNameControl() {
    return this.formGroup.get('fullNameControl') as FormControl;
  }
  get reason() {
    return this.formGroup.get('reason') as FormControl;
  }

  // @Input('title') title: string = '';
  // @Input('user-types-select') userTypesSelect: string = '';
  // @Input('block-unblock-user-actions') blockUnblockUserAction: string = '';
  // @Input('user-full-name') fullName: string = '';
  // @Input('unblocked-users-select') unblockUsersSelect: string = '';
  // @Input('blocked-users-select') blockedUsersSelect: string = '';
  // @Input('reason-for-block') reasonForBlock: string = '';
  // @Input('block-submit-button') blockSubmitButton: string = '';
  // @Input('unblock-submit-button') unblockSubmitButton: string = '';
  // public AppUtilities: typeof AppUtilities = AppUtilities;
  // $formInputs = new BehaviorSubject<BlockUnblockUserAspxInput>(
  //   {} as BlockUnblockUserAspxInput
  // );
  // public $userTypes = new BehaviorSubject<HtmlSelectOption[]>([]);
  // public $actions = new BehaviorSubject<HtmlSelectOption[]>([]);
  // public formGroup!: FormGroup;
  // constructor(
  //   private tr: TranslocoService,
  //   private fb: FormBuilder,
  //   private cdr: ChangeDetectorRef
  // ) {}
  // private createFormGroup() {
  //   this.formGroup = this.fb.group({
  //     userType: this.fb.control('', [Validators.required]),
  //     action: this.fb.control('', [Validators.required]),
  //   });
  // }
  // private formGroupChanged() {
  //   this.formGroup.valueChanges.subscribe({
  //     next: (result) => {
  //       //sessionStorage.setItem('blockUserForm', this.formGroup.value);
  //     },
  //   });
  // }
  // private userTypeChanged() {
  //   this.userType.valueChanges.subscribe({
  //     next: (value) => {
  //       this.$formInputs.subscribe({
  //         next: (formInputs) => {
  //           formInputs.userTypeSelect.value = value;
  //           //let event = new Event('change', { bubbles: false });
  //           //formInputs.userTypeSelect.dispatchEvent(event);
  //         },
  //       });
  //     },
  //   });
  // }
  // private actionChanged() {
  //   this.action.valueChanges.subscribe({
  //     next: (value) => {
  //       this.$formInputs.subscribe({
  //         next: (formInputs) => {
  //           formInputs.userActionSelect.value = value;
  //           let event = new Event('change', { bubbles: false });
  //           formInputs.userActionSelect.dispatchEvent(event);
  //         },
  //       });
  //     },
  //   });
  // }
  // private initInputForms() {
  //   let formInputs = {
  //     userTypeSelect: document.getElementById(this.userTypesSelect),
  //     userActionSelect: document.getElementById(this.blockUnblockUserAction),
  //     fullNameSelect: document.getElementById(this.fullName),
  //     reasonForBlock: document.getElementById(this.reasonForBlock),
  //     unblockedUsers: document.getElementById(this.unblockUsersSelect),
  //     blockedUsers: document.getElementById(this.blockedUsersSelect),
  //     blockSubmitButton: document.getElementById(this.blockSubmitButton),
  //     unblockSubmitButton: document.getElementById(this.unblockSubmitButton),
  //   } as BlockUnblockUserAspxInput;
  //   this.$formInputs.next(formInputs);
  // }
  // private prepareFormData() {
  //   this.$formInputs.subscribe({
  //     next: (result) => {
  //       let userTypes = AppUtilities.getSelectOptionsAsArray(
  //         result.userTypeSelect
  //       );
  //       let actions = AppUtilities.getSelectOptionsAsArray(
  //         result.userActionSelect
  //       );
  //       this.$userTypes.next(userTypes);
  //       this.$actions.next(actions);
  //     },
  //   });
  // }
  // private buiildPage() {
  //   this.createFormGroup();
  //   this.userTypeChanged();
  //   this.actionChanged();
  //   //this.formGroupChanged();
  // }
  // private verifyFormState() {
  //   let form = sessionStorage.getItem('blockUserForm');
  //   if (form) {
  //     console.log(JSON.parse(form));
  //     // let formGroup = JSON.parse(form);
  //     // this.userType.setValue(formGroup.userType);
  //     // this.action.setValue(formGroup.action);
  //   }
  // }
  // ngOnInit(): void {
  //   this.buiildPage();
  //   this.verifyFormState();
  // }
  // ngAfterViewInit(): void {
  //   this.initInputForms();
  //   this.prepareFormData();
  // }
  // ngOnDestroy(): void {
  //   sessionStorage.setItem(
  //     'blockUserForm',
  //     JSON.stringify(this.formGroup.value)
  //   );
  // }
  // get userType() {
  //   return this.formGroup.get('userType') as FormControl;
  // }
  // get action() {
  //   return this.formGroup.get('action') as FormControl;
  // }
}
