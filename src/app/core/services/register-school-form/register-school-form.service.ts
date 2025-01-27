import { Injectable, input } from '@angular/core';
import { RegisterSchoolFormInputs } from '../../interfaces/form-inputs/register-school-form-inputs';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { filter, map, Observable, switchMap } from 'rxjs';
import {
  ElementDomManipulationService,
  MElementPair,
} from '../dom-manipulation/element-dom-manipulation.service';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';
import {
  ERegisterSchool,
  EUpdateSchool,
} from '../../enums/admin/register-school-form-enum';
import { AppUtilities } from 'src/app/utilities/app-utilities';

@Injectable({
  providedIn: 'root',
})
export class RegisterSchoolFormService {
  formGroup!: FormGroup;
  ids$!: Observable<MElementPair>;
  accountDetails$!: Observable<{ [key: string]: string }[]>;
  accountDetails!: string;
  constructor(
    private fb: FormBuilder,
    private unsubscribe: UnsubscribeService,
    private domService: ElementDomManipulationService
  ) {}
  private initAccountDetails() {
    type AccountDetailControl = {
      name: string;
      validators?: ValidationErrors;
      htmlElement?: HTMLInputElement | HTMLSelectElement | HTMLAnchorElement;
    };
    const initAccountDetails = () => {
      const account$ = (details: { [key: string]: string }[]) => {
        this.accountDetails$ = new Observable((subs) => {
          subs.next(details);
          subs.complete();
        });
      };
      try {
        if (!this.accountDetails) throw Error('Account details is not defined');
        const details: { [key: string]: string }[] = JSON.parse(
          this.accountDetails
        );
        account$(details);
      } catch (error: any) {
        console.error(error.message);
        account$([]);
      }
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
    const controlValueChanges = (
      formControl: AccountDetailControl,
      control: FormControl
    ) => {
      control.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
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
    };
    const createAccountDetails = (
      accountDetails: { [key: string]: string }[]
    ) => {
      accountDetails.forEach((accountDetail) => {
        const detail = this.fb.group({});
        const createAccountDetail = (value: string, index: number) => {
          const formControl = switchAccountDetailsControls(value, index);
          if (!formControl.htmlElement) {
            const control = this.fb.control(`${index}`, formControl.validators);
            detail.addControl(formControl.name, control);
          } else if (
            (formControl.htmlElement &&
              formControl.htmlElement instanceof HTMLInputElement) ||
            formControl.htmlElement instanceof HTMLSelectElement
          ) {
            const control = this.fb.control<string>('', formControl.validators);
            formControl.htmlElement.value &&
              control.setValue(formControl.htmlElement.value);
            controlValueChanges(formControl, control);
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
        };
        Object.values(accountDetail).forEach((value, index) => {
          createAccountDetail(value, index);
        });
        this.details.push(detail);
      });
    };
    initAccountDetails();
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
  createUpdateSchoolFormGroup() {
    this.createRegisterFormGroup();
    const control = this.fb.control('', [Validators.required]);
    this.formGroup.addControl('selectedSchool', control);
  }
  initFormControls() {
    const initInput = (
      input$: Observable<HTMLInputElement>,
      control: FormControl
    ) => {
      this.domService.initHtmlInputFormControl(input$, control);
    };
    const initSelect = (
      input$: Observable<HTMLSelectElement>,
      control: FormControl
    ) => {
      this.domService.initHtmlSelectFormControl(input$, control);
    };
    initSelect(this.schoolNames$, this.selectedSchool);
    initInput(this.schoolAcronym$, this.schoolAcronym);
    initInput(this.schoolName$, this.schoolName);
    initSelect(this.branchName$, this.branchName);
    initInput(this.institutionId$, this.institutionId);
    initInput(this.schoolRegNo$, this.schoolRegNo);
    initInput(this.authorizedUser$, this.authorizedUser);
    initInput(this.emailAddress$, this.emailAddress);
    initSelect(this.countries$, this.country);
    initSelect(this.region$, this.region);
    initSelect(this.districts$, this.district);
    initSelect(this.ward$, this.ward);
    initInput(this.address$, this.address);
    initInput(this.website$, this.website);
    initInput(this.phoneNo$, this.phoneNumber);
    initInput(this.mobileNo$, this.mobileNumber);
    this.initAccountDetails();
  }
  attachValueChanges() {
    const inputValueChanges = (
      input$: Observable<HTMLInputElement>,
      control: FormControl
    ) => {
      this.domService.htmlInputFormControlValueChanges(input$, control);
    };
    const selectValueChanges = (
      input$: Observable<HTMLSelectElement>,
      control: FormControl
    ) => {
      this.domService.htmlSelectFormControlValueChanges(input$, control);
    };
    selectValueChanges(this.schoolNames$, this.selectedSchool);
    inputValueChanges(this.schoolAcronym$, this.schoolAcronym);
    inputValueChanges(this.schoolName$, this.schoolName);
    selectValueChanges(this.branchName$, this.branchName);
    inputValueChanges(this.institutionId$, this.institutionId);
    inputValueChanges(this.schoolRegNo$, this.schoolRegNo);
    inputValueChanges(this.authorizedUser$, this.authorizedUser);
    inputValueChanges(this.emailAddress$, this.emailAddress);
    selectValueChanges(this.countries$, this.country);
    selectValueChanges(this.region$, this.region);
    selectValueChanges(this.districts$, this.district);
    selectValueChanges(this.ward$, this.ward);
    inputValueChanges(this.address$, this.address);
    inputValueChanges(this.website$, this.website);
    this.domService.htmlInputFormControlPhoneNumberValueChanges(
      '255',
      this.phoneNo$,
      this.phoneNumber
    );
    this.domService.htmlInputFormControlPhoneNumberValueChanges(
      '255',
      this.mobileNo$,
      this.mobileNumber
    );
  }
  get schoolAcronym$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.SCHOOL_ACRONYM_TEXTFIELD
    );
  }
  get schoolName$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.SCHOOL_NAME_TEXTFIELD
    );
  }
  get branchName$() {
    return this.domService.getDomElement$<HTMLSelectElement>(
      this.ids$,
      ERegisterSchool.BRANCH_NAME_SELECT
    );
  }
  get institutionId$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.INSTITUTION_ID_TEXTFIELD
    );
  }
  get schoolRegNo$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.SCHOOL_REGISTRATION_NO_TEXTFIELD
    );
  }
  get authorizedUser$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.AUTHORIZED_USER_TEXTFIELD
    );
  }
  get emailAddress$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.EMAIL_ADDRESS_TEXTFIELD
    );
  }
  get countries$() {
    return this.domService.getDomElement$<HTMLSelectElement>(
      this.ids$,
      ERegisterSchool.COUNTRY_SELECT
    );
  }
  get region$() {
    return this.domService.getDomElement$<HTMLSelectElement>(
      this.ids$,
      ERegisterSchool.REGION_SELECT
    );
  }
  get districts$() {
    return this.domService.getDomElement$<HTMLSelectElement>(
      this.ids$,
      ERegisterSchool.DISTRICT_SELECT
    );
  }
  get ward$() {
    return this.domService.getDomElement$<HTMLSelectElement>(
      this.ids$,
      ERegisterSchool.WARD_SELECT
    );
  }
  get address$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.RESIDENTIAL_ADDRESS_TEXTFIELD
    );
  }
  get website$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.WEBSITE_TEXTFIELD
    );
  }
  get phoneNo$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.PHONE_NUMBER_TEXTFIELD
    );
  }
  get mobileNo$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.MOBILE_NUMBER_TEXTFIELD
    );
  }
  get addAccountDetailButton$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.ADD_NEW_ROW_BUTTON
    );
  }
  get registerSchoolButton$() {
    return this.domService.getDomElement$<HTMLInputElement>(
      this.ids$,
      ERegisterSchool.REGISTER_SCHOOL_BUTTON
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
  get schoolNames$() {
    return this.domService.getDomElement$<HTMLSelectElement>(
      this.ids$,
      EUpdateSchool.SCHOOL_NAMES_SELECT
    );
  }
  get selectedSchool() {
    return this.formGroup.get('selectedSchool') as FormControl;
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
