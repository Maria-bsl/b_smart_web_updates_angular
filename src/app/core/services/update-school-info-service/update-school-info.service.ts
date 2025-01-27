import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidationErrors,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Observable, filter, map, switchMap } from 'rxjs';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { ERegisterSchool } from '../../enums/admin/register-school-form-enum';
import {
  MElementPair,
  ElementDomManipulationService,
} from '../dom-manipulation/element-dom-manipulation.service';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateSchoolInfoService {
  formGroup!: FormGroup;
  ids$!: Observable<MElementPair>;
  accountDetails$!: Observable<{ [key: string]: string }[]>;
  constructor(
    private fb: FormBuilder,
    private unsubscribe: UnsubscribeService,
    private domService: ElementDomManipulationService
  ) {}
  private initSchoolAcronym() {
    this.schoolAcronym$.subscribe({
      next: (input) => input.value && this.schoolAcronym.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initSchoolName() {
    this.schoolName$.subscribe({
      next: (input) => input.value && this.schoolName.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initBranchName() {
    this.branchName$.subscribe({
      next: (select) =>
        select &&
        !AppUtilities.isValueEmptyElement(select) &&
        this.branchName.setValue(select.value),
      error: (err) => console.error(err.message),
    });
  }
  private initInstitutionId() {
    this.institutionId$.subscribe({
      next: (input) => this.institutionId.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initSchoolRegistrationNo() {
    this.schoolRegNo$.subscribe({
      next: (input) => this.schoolRegNo.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initAuthorizedUser() {
    this.authorizedUser$.subscribe({
      next: (input) => this.authorizedUser.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initEmailAddress() {
    this.emailAddress$.subscribe({
      next: (input) => this.emailAddress.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initCountries() {
    this.countries$.subscribe({
      next: (select) =>
        select &&
        !AppUtilities.isValueEmptyElement(select) &&
        this.country.setValue(select.value),
      error: (err) => console.error(err.message),
    });
  }
  private initRegion() {
    this.region$.subscribe({
      next: (select) =>
        select &&
        !AppUtilities.isValueEmptyElement(select) &&
        this.region.setValue(select.value),
      error: (err) => console.error(err.message),
    });
  }
  private initDistrict() {
    this.districts$.subscribe({
      next: (select) =>
        select &&
        !AppUtilities.isValueEmptyElement(select) &&
        this.district.setValue(select.value),
      error: (err) => console.error(err.message),
    });
  }
  private initWard() {
    this.ward$.subscribe({
      next: (select) =>
        select &&
        !AppUtilities.isValueEmptyElement(select) &&
        this.ward.setValue(select.value),
      error: (err) => console.error(err.message),
    });
  }
  private initAddress() {
    this.address$.subscribe({
      next: (input) => this.address.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initWebsite() {
    this.website$.subscribe({
      next: (input) => this.website.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initPhoneNo() {
    this.phoneNo$.subscribe({
      next: (input) => this.phoneNumber.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initMobileNo() {
    this.mobileNo$.subscribe({
      next: (input) => this.mobileNumber.setValue(input.value),
      error: (e) => console.error(e),
    });
  }
  private initAccountDetails() {
    type AccountDetailControl = {
      name: string;
      validators?: ValidationErrors;
      htmlElement?: HTMLInputElement | HTMLSelectElement | HTMLAnchorElement;
    };
    const switchAccountDetailsControls = (
      value: string,
      index: number
    ): AccountDetailControl => {
      switch (index) {
        case 0:
          return {
            name: 'sno',
            validators: [],
          };
        case 1:
          return {
            name: 'accountNo',
            validators: [Validators.required],
            htmlElement: document.getElementById(value) as HTMLInputElement,
          };
        case 2:
          return {
            name: 'accountName',
            validators: [Validators.required],
            htmlElement: document.getElementById(value) as HTMLInputElement,
          };
        case 3:
          return {
            name: 'currency',
            validators: [Validators.required],
            htmlElement: document.getElementById(value) as HTMLSelectElement,
          };
        case 4:
          return {
            name: 'removeButton',
            htmlElement: document.getElementById(value) as HTMLAnchorElement,
          };
        default:
          throw Error(`Account detail index not found. Index is ${index}`);
      }
    };
    const createAccountDetails = (
      accountDetails: { [key: string]: string }[]
    ) => {
      accountDetails.forEach((accountDetail) => {
        const detail = this.fb.group({});
        Object.values(accountDetail).forEach((value, index) => {
          const formControl = switchAccountDetailsControls(value, index);
          if (!formControl.htmlElement) {
            const control = this.fb.control(`${index}`, formControl.validators);
            detail.addControl(formControl.name, control);
          } else if (
            (formControl.htmlElement &&
              formControl.htmlElement instanceof HTMLInputElement) ||
            formControl.htmlElement instanceof HTMLSelectElement
          ) {
            const control = this.fb.control('', formControl.validators);
            formControl.htmlElement.value &&
              control.setValue(formControl.htmlElement.value);
            control.valueChanges
              .pipe(this.unsubscribe.takeUntilDestroy)
              .subscribe({
                next: (controlValue) => {
                  if (
                    formControl.htmlElement instanceof HTMLInputElement &&
                    controlValue
                  ) {
                    formControl.htmlElement.value = controlValue;
                  } else if (
                    formControl.htmlElement instanceof HTMLSelectElement &&
                    controlValue
                  ) {
                    formControl.htmlElement.value = controlValue;
                    this.domService.dispatchSelectElementChangeEvent(
                      formControl.htmlElement
                    );
                  }
                },
                error: (e) => console.error(e),
              });
            detail.addControl(formControl.name, control);
          } else if (
            formControl.htmlElement &&
            formControl.htmlElement instanceof HTMLAnchorElement
          ) {
            const control = this.fb.control<HTMLAnchorElement>(
              formControl.htmlElement,
              formControl.validators
            );
            detail.addControl(formControl.name, control);
          } else {
          }
        });
        this.details.push(detail);
      });
    };
    this.accountDetails$
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        filter((d) => d !== null && d !== undefined && d.length > 0)
      )
      .subscribe({
        next: (accountDetails) => createAccountDetails(accountDetails),
        error: (e) => console.error(e),
      });
  }
  private schoolAcronymValueChanges() {
    if (this.schoolAcronym$ && this.schoolAcronym) {
      this.domService.htmlInputElementValueChanges(
        this.schoolAcronym$,
        this.schoolAcronym
      );
    }
  }
  private schoolNameValueChanges() {
    if (this.schoolName$ && this.schoolName) {
      this.domService.htmlInputElementValueChanges(
        this.schoolName$,
        this.schoolName
      );
    }
  }
  private branchNameValueChanges() {
    if (this.branchName$ && this.branchName) {
      this.domService.htmlSelectElementValueChanges(
        this.branchName$,
        this.branchName
      );
    }
  }
  private institutionIdValueChanges() {
    if (this.institutionId$ && this.institutionId) {
      this.domService.htmlInputElementValueChanges(
        this.institutionId$,
        this.institutionId
      );
    }
  }
  private schoolRegNoValueChanges() {
    if (this.schoolRegNo$ && this.schoolRegNo) {
      this.domService.htmlInputElementValueChanges(
        this.schoolRegNo$,
        this.schoolRegNo
      );
    }
  }
  private authorizedUserValueChanges() {
    if (this.authorizedUser$ && this.authorizedUser) {
      this.domService.htmlInputElementValueChanges(
        this.authorizedUser$,
        this.authorizedUser
      );
    }
  }
  private emailAddressValueChanges() {
    if (this.emailAddress$ && this.emailAddress) {
      this.domService.htmlInputElementValueChanges(
        this.emailAddress$,
        this.emailAddress
      );
    }
  }
  private countryValueChanges() {
    if (this.countries$ && this.country) {
      this.domService.htmlSelectElementValueChanges(
        this.countries$,
        this.country
      );
    }
  }
  private regionValueChanges() {
    if (this.region$ && this.region) {
      this.domService.htmlSelectElementValueChanges(this.region$, this.region);
    }
  }
  private districtValueChanges() {
    if (this.districts$ && this.district) {
      this.domService.htmlSelectElementValueChanges(
        this.districts$,
        this.district
      );
    }
  }
  private wardValueChanges() {
    if (this.ward$ && this.ward) {
      this.domService.htmlSelectElementValueChanges(this.ward$, this.ward);
    }
  }
  private residentialAddressValueChanges() {
    if (this.address$ && this.address) {
      this.domService.htmlInputElementValueChanges(this.address$, this.address);
    }
  }
  private websiteValueChanges() {
    if (this.website$ && this.website) {
      this.domService.htmlInputElementValueChanges(this.website$, this.website);
    }
  }
  private phoneNoValueChanges() {
    if (this.phoneNo$ && this.phoneNumber) {
      this.domService.htmlInputElementValueChanges(
        this.phoneNo$,
        this.phoneNumber
      );
    }
  }
  private mobileNoValueChanges() {
    if (this.mobileNo$ && this.mobileNumber) {
      this.domService.htmlInputElementValueChanges(
        this.mobileNo$,
        this.mobileNumber
      );
    }
  }
  createRegisterFormGroup() {
    this.formGroup = this.fb.group({
      schoolName: this.fb.control('', Validators.required),
      schoolAcronym: this.fb.control('', [Validators.maxLength(3)]),
      schoolRegNo: this.fb.control('', [Validators.required]),
      institutionId: this.fb.control('', [Validators.required]),
      authorizedUser: this.fb.control('', [Validators.required]),
      branchName: this.fb.control('', [Validators.required]),
      emailAddress: this.fb.control('', [
        Validators.required,
        Validators.email,
      ]),
      country: this.fb.control('', []),
      region: this.fb.control('', []),
      district: this.fb.control('', []),
      ward: this.fb.control('', []),
      address: this.fb.control('', []),
      website: this.fb.control('', []),
      phoneNumber: this.fb.control('', [Validators.pattern(/^(6|7)\d{8}$/)]),
      mobileNumber: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^(6|7)\d{8}$/),
      ]),
      details: this.fb.array([], []),
    });
  }
  initFormControls() {
    this.initSchoolAcronym();
    this.initSchoolName();
    this.initBranchName();
    this.initInstitutionId();
    this.initSchoolRegistrationNo();
    this.initAuthorizedUser();
    this.initEmailAddress();
    this.initCountries();
    this.initRegion();
    this.initDistrict();
    this.initWard();
    this.initAddress();
    this.initWebsite();
    this.initPhoneNo();
    this.initMobileNo();
    this.initAccountDetails();
  }
  attachValueChanges() {
    this.schoolAcronymValueChanges();
    this.schoolNameValueChanges();
    this.branchNameValueChanges();
    this.institutionIdValueChanges();
    this.schoolRegNoValueChanges();
    this.authorizedUserValueChanges();
    this.emailAddressValueChanges();
    this.countryValueChanges();
    this.regionValueChanges();
    this.districtValueChanges();
    this.wardValueChanges();
    this.residentialAddressValueChanges();
    this.websiteValueChanges();
    this.phoneNoValueChanges();
    this.mobileNoValueChanges();
  }
  get schoolAcronym$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.SCHOOL_ACRONYM_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get schoolName$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.SCHOOL_NAME_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get branchName$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) => el.get(ERegisterSchool.BRANCH_NAME_SELECT) as HTMLSelectElement
      )
    );
  }
  get institutionId$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.INSTITUTION_ID_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get schoolRegNo$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(
            ERegisterSchool.SCHOOL_REGISTRATION_NO_TEXTFIELD
          ) as HTMLInputElement
      )
    );
  }
  get authorizedUser$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.AUTHORIZED_USER_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get emailAddress$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.EMAIL_ADDRESS_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get countries$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ERegisterSchool.COUNTRY_SELECT) as HTMLSelectElement)
    );
  }
  get region$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ERegisterSchool.REGION_SELECT) as HTMLSelectElement)
    );
  }
  get districts$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ERegisterSchool.DISTRICT_SELECT) as HTMLSelectElement)
    );
  }
  get ward$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ERegisterSchool.WARD_SELECT) as HTMLSelectElement)
    );
  }
  get address$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(
            ERegisterSchool.RESIDENTIAL_ADDRESS_TEXTFIELD
          ) as HTMLInputElement
      )
    );
  }
  get website$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(ERegisterSchool.WEBSITE_TEXTFIELD) as HTMLInputElement)
    );
  }
  get phoneNo$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.PHONE_NUMBER_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get mobileNo$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.MOBILE_NUMBER_TEXTFIELD) as HTMLInputElement
      )
    );
  }
  get addAccountDetailButton$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) => el.get(ERegisterSchool.ADD_NEW_ROW_BUTTON) as HTMLInputElement
      )
    );
  }
  get registerSchoolButton$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(ERegisterSchool.REGISTER_SCHOOL_BUTTON) as HTMLInputElement
      )
    );
  }
  get currencies$() {
    return this.accountDetails$.pipe(
      this.unsubscribe.takeUntilDestroy,
      filter((d) => d !== null && d !== undefined && d.length > 0),
      switchMap((details) =>
        details.map((r) =>
          Object.values(r).map((e) => document.getElementById(e))
        )
      ),
      map(
        (elements) =>
          elements.filter((el) => el instanceof HTMLSelectElement)[0]
      )
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
}
