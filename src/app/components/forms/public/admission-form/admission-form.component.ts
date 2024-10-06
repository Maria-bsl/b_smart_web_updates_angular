import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { BehaviorSubject, Subject, Subscription, takeUntil } from 'rxjs';
import {
  AdmissionFormActions,
  AdmissionFormInputs,
} from 'src/app/core/interfaces/form-inputs/admission-form-inputs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { FormInputService } from 'src/app/core/services/form-inputs/form-input.service';
import { AppUtilities } from 'src/app/utilities/app-utilities';

@Component({
  selector: 'app-admission-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './admission-form.component.html',
  styleUrl: './admission-form.component.scss',
})
export class AdmissionFormComponent implements OnInit, OnDestroy {
  @Input('school-name-client-id') schoolNameClientId: string = '';
  @Input('academic-year-client-id') academicYearClientId: string = '';
  @Input('class-group-client-id') classGroupClientId: string = '';
  @Input('index-no-client-id') indexNoClientId: string = '';
  @Input('student-name-client-id') studentNameClientId: string = '';
  @Input('parent-name-client-id') parentNameClientId: string = '';
  @Input('parent-mobile-client-id') parentMobileClientId: string = '';
  @Input('parent-email-client-id') parentEmailClientId: string = '';
  @Input('submit-form-button-client-id') submitFormButtonClientId: string = '';
  @Input('cancel-form-button-client-id') cancelFormButtonClientId: string = '';
  formGroup: FormGroup = this.fb.group({
    schoolName: this.fb.control('', [Validators.required]),
    academicYear: this.fb.control('', [Validators.required]),
    classGroup: this.fb.control('', [Validators.required]),
    indexNo: this.fb.control('', []),
    studentName: this.fb.control('', [Validators.required]),
    parentName: this.fb.control('', [Validators.required]),
    parentMobile: this.fb.control('', [Validators.required]),
    parentEmail: this.fb.control('', []),
  });
  schoolsNameList$ = new BehaviorSubject<HtmlSelectOption[]>([]);
  academicYearList$ = new BehaviorSubject<HtmlSelectOption[]>([]);
  classGroupsList$ = new BehaviorSubject<HtmlSelectOption[]>([]);
  formInputs$ = new BehaviorSubject<AdmissionFormInputs>(
    {} as AdmissionFormInputs
  );
  formActions$ = new BehaviorSubject<AdmissionFormActions>(
    {} as AdmissionFormActions
  );
  AppUtilities: typeof AppUtilities = AppUtilities;
  private destroyFormInputs$ = new Subject<void>();
  constructor(private fb: FormBuilder, private formService: FormInputService) {}
  private initFormInputs() {
    try {
      const formInputs: AdmissionFormInputs = {
        schoolName: document.getElementById(
          this.schoolNameClientId
        ) as HTMLSelectElement,
        academicYear: document.getElementById(
          this.academicYearClientId
        ) as HTMLSelectElement,
        classGroup: document.getElementById(
          this.classGroupClientId
        ) as HTMLSelectElement,
        indexNo: document.getElementById(
          this.indexNoClientId
        ) as HTMLInputElement,
        studentName: document.getElementById(
          this.studentNameClientId
        ) as HTMLInputElement,
        parentName: document.getElementById(
          this.parentNameClientId
        ) as HTMLInputElement,
        parentMobile: document.getElementById(
          this.parentMobileClientId
        ) as HTMLInputElement,
        parentEmail: document.getElementById(
          this.parentEmailClientId
        ) as HTMLInputElement,
      };
      if (this.formService.isValidFormInputs(formInputs)) {
        this.formInputs$.next(formInputs);
      }
    } catch (error) {
      console.error(error);
    }
  }
  private initFormActions() {
    try {
      const formActions: AdmissionFormActions = {
        submitButton: document.getElementById(
          this.submitFormButtonClientId
        ) as HTMLInputElement,
        cancelButton: document.getElementById(
          this.cancelFormButtonClientId
        ) as HTMLInputElement,
      };
      if (this.formService.isValidFormInputs(formActions)) {
        this.formActions$.next(formActions);
      }
    } catch (error) {
      console.error(error);
    }
  }
  private parseFormInputs() {
    this.formInputs$.pipe(takeUntil(this.destroyFormInputs$)).subscribe({
      next: (formInputs) => {
        this.formService.parseHtmlSelectToFormControl(
          formInputs.schoolName,
          this.schoolName
        );
        this.formService.parseHtmlSelectToFormControl(
          formInputs.academicYear,
          this.academicYear
        );
        this.formService.parseHtmlSelectToFormControl(
          formInputs.classGroup,
          this.classGroup
        );
        this.formService.parseHtmlInputToFormControl(
          formInputs.indexNo,
          this.indexNo
        );
        this.formService.parseHtmlInputToFormControl(
          formInputs.studentName,
          this.studentName
        );
        this.formService.parseHtmlInputToFormControl(
          formInputs.parentName,
          this.parentName
        );
        this.formService.parseHtmlInputToFormControl(
          formInputs.parentMobile,
          this.parentMobile
        );
        this.formService.parseHtmlInputToFormControl(
          formInputs.parentEmail,
          this.parentEmail
        );
      },
    });
  }
  ngOnInit(): void {
    this.initFormInputs();
    this.initFormActions();
    this.parseFormInputs();
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  matchHtmlElementToFormControl(
    event: any,
    control: FormControl,
    element: HTMLInputElement | HTMLSelectElement
  ) {
    this.formService.matchFormControlValueWithHtmlElementValue(
      control,
      element
    );
  }
  resetForm(cancelButton: HTMLInputElement) {
    this.formGroup.reset();
    cancelButton.click();
  }
  submitForm() {
    if (this.formGroup.valid) {
      console.log('is valid');
    } else {
      this.formGroup.markAllAsTouched();
      console.log('is invalid');
    }
  }
  get schoolName() {
    return this.formGroup.get('schoolName') as FormControl;
  }
  get academicYear() {
    return this.formGroup.get('academicYear') as FormControl;
  }
  get classGroup() {
    return this.formGroup.get('classGroup') as FormControl;
  }
  get indexNo() {
    return this.formGroup.get('indexNo') as FormControl;
  }
  get studentName() {
    return this.formGroup.get('studentName') as FormControl;
  }
  get parentName() {
    return this.formGroup.get('parentName') as FormControl;
  }
  get parentMobile() {
    return this.formGroup.get('parentMobile') as FormControl;
  }
  get parentEmail() {
    return this.formGroup.get('parentEmail') as FormControl;
  }
}
