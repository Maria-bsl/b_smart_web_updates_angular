import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import { RegisterSchoolFormEnum as UpdateSchoolFormEnum } from 'src/app/core/enums/admin/register-school-form-enum';
import {
  AccoountDetailsFormInputs,
  UpdateSchoolFormActions,
  UpdateSchoolFormInputs,
} from 'src/app/core/interfaces/form-inputs/register-school-form-inputs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { ConfirmMessageBoxComponent } from 'src/app/components/dialogs/confirm-message-box/confirm-message-box.component';

@Component({
  selector: 'app-update-school-info-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './update-school-info-form.component.html',
  styleUrl: './update-school-info-form.component.scss',
})
export class UpdateSchoolInfoFormComponent implements OnInit, OnDestroy {
  @Input('active-schools-select') activeSchoolsSelect: string = '';
  @Input('school-name-client-id') schoolNameClientId: string = '';
  @Input('school-acronym-client-id') schoolAcronymClientId: string = '';
  @Input('institution-client-id') institutionClientId: string = '';
  @Input('school-reg-no-client-id') schoolRegNoClientId: string = '';
  @Input('authorized-user-client-id') authorizedUserClientId: string = '';
  @Input('branch-name-select-client-id') branchNameSelectId: string = '';
  @Input('email-address-client-id') emailAddressClientId: string = '';
  @Input('country-select-client-id') countrySelectClientId: string = '';
  @Input('region-select-client-id') regionSelectClientId: string = '';
  @Input('district-select-client-id') districtSelectClientId: string = '';
  @Input('ward-select-client-id') wardSelectClientId: string = '';
  @Input('address-client-id') addressClientId: string = '';
  @Input('website-client-id') websiteClientId: string = '';
  @Input('phone-number-client-id') phoneNumberClientId: string = '';
  @Input('mobile-number-client-id') mobileNumberClientId: string = '';
  @Input('account-details-array') accountDetailsArray: string = '';
  @Input('add-new-row-button-client-id') addNewRowClientId: string = '';
  @Input('register-button-client-id') registerClientId: string = '';
  @Input('cancel-button-client-id') cancelButtonClientId: string = '';
  formInputs$ = new BehaviorSubject<UpdateSchoolFormInputs>(
    {} as UpdateSchoolFormInputs
  );
  formActions$ = new BehaviorSubject<UpdateSchoolFormActions>(
    {} as UpdateSchoolFormActions
  );
  $activeSchools = new BehaviorSubject<HtmlSelectOption[]>([]);
  $branches = new BehaviorSubject<HtmlSelectOption[]>([]);
  $countries = new BehaviorSubject<HtmlSelectOption[]>([]);
  $regions = new BehaviorSubject<HtmlSelectOption[]>([]);
  $districts = new BehaviorSubject<HtmlSelectOption[]>([]);
  $wards = new BehaviorSubject<HtmlSelectOption[]>([]);
  formGroup: FormGroup = this.fb.group({
    schoolName: this.fb.control('', Validators.required),
    schoolAcronym: this.fb.control('', [Validators.maxLength(3)]),
    schoolRegNo: this.fb.control('', [Validators.required]),
    institutionId: this.fb.control('', [Validators.required]),
    authorizedUser: this.fb.control('', [Validators.required]),
    branchName: this.fb.control('', [Validators.required]),
    emailAddress: this.fb.control('', [Validators.required, Validators.email]),
    country: this.fb.control('', []),
    region: this.fb.control('', []),
    district: this.fb.control('', []),
    ward: this.fb.control('', []),
    address: this.fb.control('', []),
    website: this.fb.control('', []),
    phoneNumber: this.fb.control('', []),
    mobileNumber: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^(6|7)\d{8}$/),
    ]),
    details: this.fb.array([], []),
    activeSchool: this.fb.control('', [Validators.required]),
  });
  // activeSchool: FormControl = this.fb.control('', [Validators.required]);
  AppUtilities: typeof AppUtilities = AppUtilities;
  private destroyFormInputs$ = new Subject<void>();
  private subscriptions: Subscription[] = [];
  private isValidFormInputs(
    formInputs: UpdateSchoolFormInputs | UpdateSchoolFormActions
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
      const formInputs: UpdateSchoolFormInputs = {
        activeSchoolName: document.getElementById(
          this.activeSchoolsSelect
        ) as HTMLSelectElement,
        schoolNameInput: document.getElementById(
          this.schoolNameClientId
        ) as HTMLInputElement,
        schoolAcronymInput: document.getElementById(
          this.schoolAcronymClientId
        ) as HTMLInputElement,
        institutionIdInput: document.getElementById(
          this.institutionClientId
        ) as HTMLInputElement,
        schoolRegNoInput: document.getElementById(
          this.schoolRegNoClientId
        ) as HTMLInputElement,
        authorizedUserInput: document.getElementById(
          this.authorizedUserClientId
        ) as HTMLInputElement,
        branchNameSelect: document.getElementById(
          this.branchNameSelectId
        ) as HTMLSelectElement,
        emailAddressInput: document.getElementById(
          this.emailAddressClientId
        ) as HTMLInputElement,
        countriesSelect: document.getElementById(
          this.countrySelectClientId
        ) as HTMLSelectElement,
        regionSelect: document.getElementById(
          this.regionSelectClientId
        ) as HTMLSelectElement,
        districtSelect: document.getElementById(
          this.districtSelectClientId
        ) as HTMLSelectElement,
        wardSelect: document.getElementById(
          this.wardSelectClientId
        ) as HTMLSelectElement,
        addressInput: document.getElementById(
          this.addressClientId
        ) as HTMLInputElement,
        websiteInput: document.getElementById(
          this.websiteClientId
        ) as HTMLInputElement,
        phoneNumber: document.getElementById(
          this.phoneNumberClientId
        ) as HTMLInputElement,
        mobileNumber: document.getElementById(
          this.mobileNumberClientId
        ) as HTMLInputElement,
        accountDetails: (JSON.parse(this.accountDetailsArray) as any[]).map(
          (item) => {
            return {
              accountNoInput: document.getElementById(
                item[UpdateSchoolFormEnum.ACCOUNT_NO]
              ) as HTMLInputElement,
              currenySelect: document.getElementById(
                item[UpdateSchoolFormEnum.CURRENCY]
              ) as HTMLSelectElement,
              removeInput: document.getElementById(
                item[UpdateSchoolFormEnum.REMOVE_ACTION]
              ) as HTMLInputElement,
            };
          }
        ),
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
      const formActions: UpdateSchoolFormActions = {
        addRowButton: document.getElementById(
          this.addNewRowClientId
        ) as HTMLInputElement,
        registerButton: document.getElementById(
          this.registerClientId
        ) as HTMLInputElement,
        cancelButton: document.getElementById(
          this.cancelButtonClientId
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
          this.parseActiveSchoolName(formInputs.activeSchoolName);
          this.parseSchoolNameInput(formInputs.schoolNameInput);
          this.parseSchoolAcronym(formInputs.schoolAcronymInput);
          this.parseSchoolRegNo(formInputs.schoolRegNoInput);
          this.parseInstitutionId(formInputs.institutionIdInput);
          this.parseAuthorizedUserId(formInputs.authorizedUserInput);
          this.parseBranchName(formInputs.branchNameSelect);
          this.parseEmailAddress(formInputs.emailAddressInput);
          this.parseCountry(formInputs.countriesSelect);
          this.parseRegion(formInputs.regionSelect);
          this.parseDistrict(formInputs.districtSelect);
          this.parseWard(formInputs.wardSelect);
          this.parseAddress(formInputs.addressInput);
          this.parseWebsite(formInputs.websiteInput);
          this.parsePhoneNumber(formInputs.phoneNumber);
          this.parseMobileNumber(formInputs.mobileNumber);
          this.parseAccountDetails(formInputs.accountDetails);
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  private parseActiveSchoolName(activeSchool: HTMLSelectElement) {
    let branches = AppUtilities.getSelectOptionsAsArray(activeSchool);
    if (!AppUtilities.isValueEmptyElement(activeSchool)) {
      this.activeSchool.setValue(activeSchool.value);
    }
    this.$activeSchools.next(branches);
    this.activeSchool.valueChanges.subscribe({
      next: (value) => {
        activeSchool.value = value;
        let event = new Event('change', { bubbles: true });
        activeSchool.dispatchEvent(event);
      },
    });
  }
  private parseSchoolNameInput(schoolName: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(schoolName)) {
      this.schoolName.setValue(schoolName.value);
    }
    this.schoolName.valueChanges.subscribe({
      next: (value) => {
        schoolName.value = value;
      },
    });
  }
  private parseSchoolAcronym(schoolAcronym: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(schoolAcronym)) {
      this.schoolAcronym.setValue(schoolAcronym.value);
    }
    this.schoolAcronym.valueChanges.subscribe({
      next: (value) => {
        schoolAcronym.value = value;
      },
    });
  }
  private parseSchoolRegNo(schoolReg: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(schoolReg)) {
      this.schoolRegNo.setValue(schoolReg.value);
    }
    this.schoolRegNo.valueChanges.subscribe({
      next: (value) => {
        schoolReg.value = value;
      },
    });
  }
  private parseInstitutionId(institutinId: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(institutinId)) {
      this.institutionId.setValue(institutinId.value);
    }
    this.institutionId.valueChanges.subscribe({
      next: (value) => {
        institutinId.value = value;
      },
    });
  }
  private parseAuthorizedUserId(authorizedUserId: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(authorizedUserId)) {
      this.authorizedUser.setValue(authorizedUserId.value);
    }
    this.authorizedUser.valueChanges.subscribe({
      next: (value) => {
        authorizedUserId.value = value;
      },
    });
  }
  private parseEmailAddress(email: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(email)) {
      this.emailAddress.setValue(email.value);
    }
    this.emailAddress.valueChanges.subscribe({
      next: (value) => {
        email.value = value;
      },
    });
  }
  private parseBranchName(branch: HTMLSelectElement) {
    let branches = AppUtilities.getSelectOptionsAsArray(branch);
    if (!AppUtilities.isValueEmptyElement(branch)) {
      this.branchName.setValue(branch.value);
    }
    this.$branches.next(branches);
    this.branchName.valueChanges.subscribe({
      next: (value) => {
        branch.value = value;
        let event = new Event('change', { bubbles: true });
        branch.dispatchEvent(event);
      },
    });
  }
  private parseCountry(country: HTMLSelectElement) {
    if (!AppUtilities.isValueEmptyElement(country)) {
      this.country.setValue(country.value);
    }
    let countries = AppUtilities.getSelectOptionsAsArray(country);
    this.$countries.next(countries);
    this.country.valueChanges.subscribe({
      next: (value) => {
        country.value = value;
        let event = new Event('change', { bubbles: true });
        country.dispatchEvent(event);
      },
    });
  }
  private parseRegion(region: HTMLSelectElement) {
    if (!AppUtilities.isValueEmptyElement(region)) {
      this.region.setValue(region.value);
    }
    let regions = AppUtilities.getSelectOptionsAsArray(region);
    this.$regions.next(regions);
    this.region.valueChanges.subscribe({
      next: (value) => {
        region.value = value;
        let event = new Event('change', { bubbles: true });
        region.dispatchEvent(event);
      },
    });
  }
  private parseDistrict(district: HTMLSelectElement) {
    let districts = AppUtilities.getSelectOptionsAsArray(district);
    if (!AppUtilities.isValueEmptyElement(district)) {
      this.district.setValue(district.value);
    }
    this.$districts.next(districts);
    this.district.valueChanges.subscribe({
      next: (value) => {
        district.value = value;
        let event = new Event('change', { bubbles: true });
        district.dispatchEvent(event);
      },
    });
  }
  private parseWard(ward: HTMLSelectElement) {
    let wards = AppUtilities.getSelectOptionsAsArray(ward);
    if (!AppUtilities.isValueEmptyElement(ward)) {
      this.ward.setValue(ward.value);
    }
    this.$wards.next(wards);
    this.ward.valueChanges.subscribe({
      next: (value) => {
        ward.value = value;
        let event = new Event('change', { bubbles: true });
        ward.dispatchEvent(event);
      },
    });
  }
  private parseAddress(address: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(address)) {
      this.address.setValue(address.value);
    }
    this.address.valueChanges.subscribe({
      next: (value) => {
        address.value = value;
      },
    });
  }
  private parseWebsite(website: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(website)) {
      this.website.setValue(website.value);
    }
    this.website.valueChanges.subscribe({
      next: (value) => {
        website.value = value;
      },
    });
  }
  private parsePhoneNumber(phoneNumber: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(phoneNumber)) {
      this.phoneNumber.setValue(phoneNumber.value);
    }
    this.phoneNumber.valueChanges.subscribe({
      next: (value) => {
        phoneNumber.value = value;
      },
    });
  }
  private parseMobileNumber(mobileNumber: HTMLInputElement) {
    if (!AppUtilities.isValueEmptyElement(mobileNumber)) {
      this.mobileNumber.setValue(mobileNumber.value);
    }
    this.mobileNumber.valueChanges.subscribe({
      next: (value) => {
        mobileNumber.value = value;
      },
    });
  }
  private parseAccountDetails(accountDetails: AccoountDetailsFormInputs[]) {
    accountDetails.forEach((detail) => {
      let group = this.fb.group({
        accountNo: this.fb.control('', [Validators.required]),
        currency: this.fb.control('', [Validators.required]),
      });
      if (
        detail.accountNoInput.value &&
        detail.accountNoInput.value.length > 0
      ) {
        group.get('accountNo')?.setValue(detail.accountNoInput.value);
      }
      if (detail.currenySelect.value && detail.currenySelect.value.length > 0) {
        group.get('currency')?.setValue(detail.currenySelect.value);
      }
      group.get('accountNo')?.valueChanges.subscribe({
        next: (value) => {
          detail.accountNoInput.value = value ?? '';
        },
      });
      group.get('currency')?.valueChanges.subscribe({
        next: (value) => {
          detail.currenySelect.value = value ?? '';
        },
      });
      this.details.push(group);
    });
  }
  private openConfirmDialog() {
    let dialogRef = this.dialogCdk.open(ConfirmMessageBoxComponent, {
      minWidth: '300px',
      data: {
        title: 'Register New School',
        message: 'Are you sure you want to save changes?',
      },
    });
    dialogRef.componentInstance?.closeClicked.asObservable().subscribe({
      next: () => {
        dialogRef.close();
      },
    });
    dialogRef.componentInstance?.confirmClicked.asObservable().subscribe({
      next: () => {
        dialogRef.close();
        this.subscriptions.push(
          this.formActions$.subscribe({
            next: (formActions) => {
              formActions.registerButton.click();
            },
          })
        );
      },
    });
  }
  private addBankDetailRow() {
    this.subscriptions.push(
      this.formActions$.subscribe({
        next: (formActions) => {
          formActions.addRowButton.click();
        },
      })
    );
  }
  constructor(private fb: FormBuilder, private dialogCdk: Dialog) {}
  ngOnInit(): void {
    this.initFormInputs();
    this.initFormActions();
    this.parseFormInputs();
  }
  ngOnDestroy(): void {
    this.formGroup.reset();
    this.destroyFormInputs$.next();
    this.destroyFormInputs$.complete();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  matchSchoolName(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.schoolName.value !== formInputs.schoolNameInput.value) {
            formInputs.schoolNameInput.value = this.schoolName.value;
          }
        },
      })
    );
  }
  matchSchoolAcronym(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (
            this.schoolAcronym.value !== formInputs.schoolAcronymInput.value
          ) {
            formInputs.schoolAcronymInput.value = this.schoolAcronym.value;
          }
        },
      })
    );
  }
  matchSchoolRegNo(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.schoolRegNo.value !== formInputs.schoolRegNoInput.value) {
            formInputs.schoolRegNoInput.value = this.schoolRegNo.value;
          }
        },
      })
    );
  }
  matchInstitutionId(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (
            this.institutionId.value !== formInputs.institutionIdInput.value
          ) {
            formInputs.institutionIdInput.value = this.institutionId.value;
          }
        },
      })
    );
  }
  matchAuthorizedUser(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (
            this.authorizedUser.value !== formInputs.authorizedUserInput.value
          ) {
            formInputs.authorizedUserInput.value = this.authorizedUser.value;
          }
        },
      })
    );
  }
  matchBranch(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.branchName.value !== formInputs.branchNameSelect.value) {
            formInputs.branchNameSelect.value = this.branchName.value;
          }
        },
      })
    );
  }
  matchEmailAddress(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.emailAddress.value !== formInputs.emailAddressInput.value) {
            formInputs.emailAddressInput.value = this.emailAddress.value;
          }
        },
      })
    );
  }
  matchCountry(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.country.value !== formInputs.countriesSelect.value) {
            formInputs.countriesSelect.value = this.country.value;
          }
        },
      })
    );
  }
  matchRegion(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.region.value !== formInputs.regionSelect.value) {
            formInputs.regionSelect.value = this.region.value;
          }
        },
      })
    );
  }
  matchDistrict(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.district.value !== formInputs.districtSelect.value) {
            formInputs.districtSelect.value = this.district.value;
          }
        },
      })
    );
  }
  matchWard(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.ward.value !== formInputs.wardSelect.value) {
            formInputs.wardSelect.value = this.ward.value;
          }
        },
      })
    );
  }
  matchWebsite(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.website.value !== formInputs.websiteInput.value) {
            formInputs.websiteInput.value = this.website.value;
          }
        },
      })
    );
  }
  matchPhoneNumber(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.phoneNumber.value !== formInputs.phoneNumber.value) {
            formInputs.phoneNumber.value = this.phoneNumber.value;
          }
        },
      })
    );
  }
  matchMobileNumber(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.mobileNumber.value !== formInputs.mobileNumber.value) {
            formInputs.mobileNumber.value = this.mobileNumber.value;
          }
        },
      })
    );
  }
  matchResidentialAddress(event: any) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          if (this.address.value !== formInputs.addressInput.value) {
            formInputs.addressInput.value = this.address.value;
          }
        },
      })
    );
  }
  matchAccountNumber(event: any, index: number) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          let detail = formInputs.accountDetails.at(index);
          let accountNo = this.details.controls.at(index)?.get('accountNo');
          if (
            detail &&
            detail.accountNoInput &&
            detail.accountNoInput.value !== accountNo?.value
          ) {
            detail.accountNoInput = accountNo?.value;
          }
        },
      })
    );
  }
  matchCurrency(event: any, index: number) {
    this.subscriptions.push(
      this.formInputs$.subscribe({
        next: (formInputs) => {
          let detail = formInputs.accountDetails.at(index);
          let currency = this.details.controls.at(index)?.get('currency');
          if (
            detail &&
            detail.currenySelect &&
            detail.currenySelect.value !== currency?.value
          ) {
            detail.currenySelect = currency?.value;
          }
        },
      })
    );
  }
  addBankDetail(ind: number = -1) {
    let MAX = 1000;
    if (ind > -1 && this.details.at(ind).valid && this.details.length < MAX) {
      this.addBankDetailRow();
    } else if (ind > -1 && this.details.at(ind).invalid) {
      this.details.at(ind).markAllAsTouched();
    } else if (this.details.length < MAX) {
      this.addBankDetailRow();
    } else {
    }
  }
  removeBankDetail(ind: number) {
    if (this.details.length > 1) {
      this.subscriptions.push(
        this.formInputs$.subscribe({
          next: (formInputs) => {
            let detail = formInputs.accountDetails.at(ind);
            detail?.removeInput.click();
          },
        })
      );
    }
  }
  onSubmitForm() {
    if (this.formGroup.valid) {
      this.openConfirmDialog();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  resetForm() {
    this.subscriptions.push(
      this.formActions$.subscribe({
        next: (formActions) => {
          this.formGroup.reset();
          formActions.cancelButton.click();
        },
      })
    );
  }
  get schoolName() {
    return this.formGroup.get('schoolName') as FormControl;
  }
  get schoolAcronym() {
    return this.formGroup.get('schoolAcronym') as FormControl;
  }
  get schoolRegNo() {
    return this.formGroup.get('schoolRegNo') as FormControl;
  }
  get institutionId() {
    return this.formGroup.get('institutionId') as FormControl;
  }
  get authorizedUser() {
    return this.formGroup.get('authorizedUser') as FormControl;
  }
  get branchName() {
    return this.formGroup.get('branchName') as FormControl;
  }
  get emailAddress() {
    return this.formGroup.get('emailAddress') as FormControl;
  }
  get country() {
    return this.formGroup.get('country') as FormControl;
  }
  get region() {
    return this.formGroup.get('region') as FormControl;
  }
  get district() {
    return this.formGroup.get('district') as FormControl;
  }
  get ward() {
    return this.formGroup.get('ward') as FormControl;
  }
  get address() {
    return this.formGroup.get('address') as FormControl;
  }
  get website() {
    return this.formGroup.get('website') as FormControl;
  }
  get phoneNumber() {
    return this.formGroup.get('phoneNumber') as FormControl;
  }
  get mobileNumber() {
    return this.formGroup.get('mobileNumber') as FormControl;
  }
  get details() {
    return this.formGroup.get('details') as FormArray;
  }
  get activeSchool() {
    return this.formGroup.get('activeSchool') as FormControl;
  }
}
