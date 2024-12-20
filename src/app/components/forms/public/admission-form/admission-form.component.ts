import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
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
import {
  BehaviorSubject,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { EAdmissionForm } from 'src/app/core/enums/admission-form.enum';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';
import {
  AdmissionFormActions,
  AdmissionFormInputs,
} from 'src/app/core/interfaces/form-inputs/admission-form-inputs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { FormInputService } from 'src/app/core/services/form-inputs/form-input.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
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
export class AdmissionFormComponent
  implements AfterViewInit, OnGenericComponent
{
  @Input('keys') keys: string = '';
  formGroup!: FormGroup;
  schoolsNameList$ = new BehaviorSubject<HtmlSelectOption[]>([]);
  academicYearList$ = new BehaviorSubject<HtmlSelectOption[]>([]);
  classGroupsList$ = new BehaviorSubject<HtmlSelectOption[]>([]);
  AppUtilities: typeof AppUtilities = AppUtilities;
  ids$!: Observable<MElementPair>;
  constructor(
    private fb: FormBuilder,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService
  ) {
    this.createFormGroup();
  }
  private createFormGroup() {
    this.formGroup = this.fb.group({
      schoolName: this.fb.control('', [Validators.required]),
      academicYear: this.fb.control('', [Validators.required]),
      classGroup: this.fb.control('', [Validators.required]),
      indexNo: this.fb.control('', []),
      studentName: this.fb.control('', [Validators.required]),
      parentName: this.fb.control('', [Validators.required]),
      parentMobile: this.fb.control('', [Validators.required]),
      parentEmail: this.fb.control('', []),
    });
  }
  private schoolNameEventHandler() {
    const setSchoolName = (value: string, el: HTMLSelectElement) => {
      el.value = value;
      this.domService.dispatchSelectElementChangeEvent(el);
    };
    const schoolName$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.SCHOOL_NAME) as HTMLSelectElement)
    );
    const updateSchoolName = (value: string) => {
      schoolName$.subscribe({
        next: (selectElement) => setSchoolName(value, selectElement),
        error: (err) => console.error(err.message),
      });
    };
    this.schoolName.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updateSchoolName(value),
        error: (err) => console.error(err.message),
      });
  }
  private academicYearEventHandler() {
    const setAcademicYear = (value: string, el: HTMLSelectElement) => {
      el.value = value;
      this.domService.dispatchSelectElementChangeEvent(el);
    };
    const academicYear$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.ADMISSION_YEAR) as HTMLSelectElement)
    );
    const updateAcademicYear = (value: string) => {
      academicYear$.subscribe({
        next: (selectElement) => setAcademicYear(value, selectElement),
        error: (err) => console.error(err.message),
      });
    };
    this.academicYear.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updateAcademicYear(value),
        error: (err) => console.error(err.message),
      });
  }
  private classGroupEventHandler() {
    const setClassGroup = (value: string, el: HTMLSelectElement) => {
      el.value = value;
      this.domService.dispatchSelectElementChangeEvent(el);
    };
    const classGroup$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.CLASS_GROUP) as HTMLSelectElement)
    );
    const updateClassGroup = (value: string) => {
      classGroup$.subscribe({
        next: (selectElement) => setClassGroup(value, selectElement),
        error: (err) => console.error(err.message),
      });
    };
    this.classGroup.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => updateClassGroup(value),
        error: (err) => console.error(err.message),
      });
  }
  private indexNumberEventHandler() {
    const indexNumber$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.INDEX_NUMBER) as HTMLInputElement)
    );
    this.indexNo.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) =>
          this.domService.setHtmlElementValue(indexNumber$, value),
        error: (err) => console.error(err.message),
      });
  }
  private studentNameEventHandler() {
    const studentName$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.STUDENT_NAME) as HTMLInputElement)
    );
    this.studentName.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) =>
          this.domService.setHtmlElementValue(studentName$, value),
        error: (err) => console.error(err.message),
      });
  }
  private parentNameEventHandler() {
    const parentName$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.PARENT_NAME) as HTMLInputElement)
    );
    this.parentName.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) =>
          this.domService.setHtmlElementValue(parentName$, value),
        error: (err) => console.error(err.message),
      });
  }
  private parentMobileEventHandler() {
    const parentMobile$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.PARENT_MOBILE) as HTMLInputElement)
    );
    this.parentMobile.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) =>
          this.domService.setHtmlElementValue(parentMobile$, value),
        error: (err) => console.error(err.message),
      });
  }
  private parentEmailEventHandler() {
    const parentEmail$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.PARENT_EMAIL) as HTMLInputElement)
    );
    this.parentEmail.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) =>
          this.domService.setHtmlElementValue(parentEmail$, value),
        error: (err) => console.error(err.message),
      });
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.initIds();
  }
  initIds() {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(EAdmissionForm).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers() {
    this.schoolNameEventHandler();
    this.academicYearEventHandler();
    this.classGroupEventHandler();
    this.indexNumberEventHandler();
    this.studentNameEventHandler();
    this.parentNameEventHandler();
    this.parentMobileEventHandler();
    this.parentEmailEventHandler();
  }
  resetForm() {
    const cancel$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.CANCEL_BUTTON) as HTMLElement)
    );
    cancel$.subscribe({
      next: (button) => this.createFormGroup(),
      error: (err) => console.error(err.message),
    });
  }
  submitForm() {
    const submit$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EAdmissionForm.SUBMIT_BUTTON) as HTMLInputElement)
    );
    const subscribe = () => {
      submit$.subscribe({
        next: (button) => this.domService.clickButton(button),
        error: (err) => console.error(err.message),
      });
    };
    this.formGroup.valid ? subscribe() : this.formGroup.markAllAsTouched();
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
