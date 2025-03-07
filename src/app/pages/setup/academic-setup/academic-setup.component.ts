import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  combineLatest,
  concat,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  zip,
} from 'rxjs';
import { filterNotNull } from 'src/app/components/forms/admin/login-form/login-form.component';
import {
  EAcademicSetup,
  EAcademicSetupItem,
} from 'src/app/core/enums/admin/setup/academic-setup.enum';
import { OnGenericComponent } from 'src/app/core/interfaces/on-generic-component';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import {
  AcademicService,
  THtmlElementControls,
} from 'src/app/core/services/admin/setup/academic/academic.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AcademicTableComponent } from 'src/app/components/templates/admin/setup/academic-table/academic-table.component';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { MatDividerModule } from '@angular/material/divider';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';

@Component({
<<<<<<< HEAD
    selector: 'app-academic-setup',
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        MatFormFieldModule,
        MatInputModule,
        HasFormControlErrorPipe,
        MatRadioModule,
        MatButtonModule,
        CommonModule,
        AcademicTableComponent,
        MatDividerModule,
    ],
    templateUrl: './academic-setup.component.html',
    styleUrl: './academic-setup.component.scss',
    animations: [inOutAnimation]
=======
  selector: 'app-academic-setup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    HasFormControlErrorPipe,
    MatRadioModule,
    MatButtonModule,
    CommonModule,
    AcademicTableComponent,
    MatDividerModule,
  ],
  templateUrl: './academic-setup.component.html',
  styleUrl: './academic-setup.component.scss',
  animations: [inOutAnimation],
>>>>>>> eb465d57eeec39fca151ad86e20fd4337434531a
}) //, OnGenericComponent
export class AcademicSetupComponent implements AfterViewInit {
  @Input('keys') keys: string = '';
  @Input('academic-setup-table') academicTable: string = '';
  @ViewChild('setupTable') setupTable!: AcademicTableComponent;
  private _ids$!: Observable<MElementPair>;
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  constructor(
    private _dom: ElementDomManipulationService,
    private languageService: LanguageService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        academicYear: this._fb.control('', [Validators.required]),
        academicStatus: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private handlers() {
    const deselectRowsHandler = () => {
      return this.setupTable.deselectedAllRows.asObservable().pipe(
        switchMap(() => this.cancelButton$),
        this.unsubscribe.takeUntilDestroy
      );
    };
    const deleteRow = () => {
      return this.setupTable.deleteRow.asObservable().pipe(
        this.unsubscribe.takeUntilDestroy,
        switchMap(() =>
          this._appConfig.openConfirmationDialog(
            'defaults.delete',
            'defaults.thisCannotBeUndone'
          )
        ),
        switchMap((dialogRef) =>
          dialogRef.componentInstance.confirmClicked.asObservable()
        ),
        switchMap(() => this.deleteButton$)
      );
    };
    deselectRowsHandler().subscribe(this._dom.clickButton);
    deleteRow().subscribe(this._dom.clickButton);
  }
  private initIds(): void {
    this._ids$ = this._dom.createIds(this.keys, EAcademicSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.academicYear$, this.academicYear],
        [this.academicRadioButtons$, this.academicStatus],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    registerControls();
  }
  ngAfterViewInit(): void {
    this.initIds();
    this.handlers();
  }
  resetForm(event: MouseEvent) {
    event.preventDefault();
    this._formGroup.setValue(this._copyFormGroup.value);
  }
  submitForm(event: MouseEvent) {
    event.preventDefault();
    const isUpdate = this.setupTable.selection.hasValue();
    const confirmMessage$ = () => {
      const title = isUpdate ? 'defaults.update' : 'defaults.create';
      return this._appConfig.openConfirmationDialog(
        title,
        'defaults.saveChanges'
      );
    };
    if (this.formGroup.valid) {
      confirmMessage$()
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          switchMap((dialogRef) =>
            dialogRef.componentInstance.confirmClicked.asObservable()
          ),
          switchMap(() => (isUpdate ? this.updateButton$ : this.createButton$))
        )
        .subscribe(this._dom.clickButton);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  get academicYear$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAcademicSetup.ACADEMIC_TEXTFIELD
    );
  }
  get academicRadioButtons$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        EAcademicSetup.ACADEMIC_STATUS_RADIO_GROUP
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.querySelectorAll('input[type="radio"]'))
      );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAcademicSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAcademicSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAcademicSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAcademicSetup.DELETE_BUTTON
    );
  }
  get formGroup() {
    return this._formGroup;
  }
  get academicYear() {
    return this._formGroup.get('academicYear') as FormControl;
  }
  get academicStatus() {
    return this._formGroup.get('academicStatus') as FormControl;
  }
}
