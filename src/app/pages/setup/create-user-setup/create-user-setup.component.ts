import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { concatMap, map, Observable, of, switchMap, zip } from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { DesignationTableItemComponent } from 'src/app/components/components/designation-table-item/designation-table-item.component';
import { ProgressTableItemComponent } from 'src/app/components/components/progress-table-item/progress-table-item.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { TableSelectedPipe } from 'src/app/core/pipes/tables/table-selected.pipe';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { TableItem } from 'src/app/shared/logic/table-item';
import { AppConst } from 'src/app/utilities/app-consts';

export enum ECreateUserSetup {
  USER_NUMBER_TEXTFIELD,
  FIRST_NAME_TEXTFIELD,
  MIDDLE_NAME_TEXTFIELD,
  LAST_NAME_TEXTFIELD,
  DESIGNATION_SELECT,
  MOBILE_NUMBER_TEXTFIELD,
  EMAIL_TEXTFIELD,
  BRANCH_SELECT,
  FEE_ALLOCATION_STATUS_BUTTONS,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum ECreateUserSetupItem {
  SELECTOR_BUTTON,
  EMPLOYEE_SNO,
  EMPLOYEE_NUMBER,
  FULL_NAME,
  DESIGNATION,
  EMAIL_ID,
  APP_STATUS,
  EMPLOYEE_STATUS,
}

export type CreateUserSetupItem = {
  selector?: HTMLInputElement;
  employeeNo?: string;
  fullName?: string;
  designation?: string;
  emailId?: string;
  appStatus?: string;
  employeeStatus?: string;
};

@Component({
    selector: 'app-create-user-setup',
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ZoneSetupTableComponent,
        RegionSetupTableComponent,
        MatRadioModule,
        CommonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        ActiveInactiveComponent,
        IsSelectedItemPipe,
        HasFormControlErrorPipe,
        TableSelectedPipe,
        DesignationTableItemComponent,
        ProgressTableItemComponent,
    ],
    templateUrl: './create-user-setup.component.html',
    styleUrl: './create-user-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class CreateUserSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'userNo',
    'fullName',
    'designation',
    'emailAddress',
    'progress',
    'status',
  ]);
  @Input('keys') keys: string = '';
  @Input('create-user-table') jsonTable: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  designationList$!: Observable<HtmlSelectOption[]>;
  branchList$!: Observable<HtmlSelectOption[]>;
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private languageService: LanguageService,
    private _table: TableDataService<CreateUserSetupItem>
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(
    item: KeyValuePair
  ): Observable<CreateUserSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      ECreateUserSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const userNo$ = tableItem.getTableItem$<string>(
      ECreateUserSetupItem.EMPLOYEE_NUMBER,
      (value: string) => value
    );
    const fullName$ = tableItem.getTableItem$<string>(
      ECreateUserSetupItem.FULL_NAME,
      (value: string) => value
    );
    const designation$ = tableItem.getTableItem$<string>(
      ECreateUserSetupItem.DESIGNATION,
      (value: string) => value
    );
    const email$ = tableItem.getTableItem$<string>(
      ECreateUserSetupItem.EMAIL_ID,
      (value: string) => value
    );
    const progress$ = tableItem.getTableItem$<string>(
      ECreateUserSetupItem.APP_STATUS,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      ECreateUserSetupItem.EMPLOYEE_STATUS,
      (value: string) => value
    );
    const zipped$ = zip(
      selector$,
      userNo$,
      fullName$,
      designation$,
      email$,
      progress$,
      status$
    );
    return zipped$.pipe(
      map(
        ([
          selector,
          userNo,
          fullName,
          designation,
          email,
          progress,
          status,
        ]) => {
          const item: CreateUserSetupItem = {
            selector: selector,
            employeeNo: userNo,
            fullName: fullName,
            designation: designation,
            emailId: email,
            appStatus: progress,
            employeeStatus: status,
          };
          return item;
        }
      )
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        userNo: this._fb.control('', [Validators.required]),
        firstName: this._fb.control('', [Validators.required]),
        middleName: this._fb.control('', []),
        lastName: this._fb.control('', [Validators.required]),
        designation: this._fb.control('', [Validators.required]),
        mobileNo: this._fb.control('', [
          Validators.required,
          Validators.pattern(AppConst.TANZANIA_MOBILE_NUMBER_REGEX),
        ]),
        emailAddress: this._fb.control('', [
          Validators.required,
          Validators.email,
        ]),
        branch: this._fb.control('', [Validators.required]),
        feeAllocationStatus: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, ECreateUserSetup);
    const controls: THtmlElementControls[] = [
      [this.userNo$, this.userNo],
      [this.firstName$, this.firstName],
      [this.middleName$, this.middleName],
      [this.lastName$, this.lastName],
      [this.designation$, this.designation],
      [this.mobileNo$, this.mobileNo],
      [this.emailAddress$, this.emailAddress],
      [this.branch$, this.branch],
      [this.feeAllocationStatuses$, this.feeAllocationStatus],
    ];
    const events = this._dom.registerFormControls(controls);
    events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      error: (e) => console.error(e),
      complete: () => this._copyFormGroup.setValue(this.formGroup.value),
    });
    this.branchList$ = this.branch$.pipe(
      map((select) => this._dom.getSelectOptionsAsArray(select))
    );
    this.designationList$ = this.designation$.pipe(
      map((select) => this._dom.getSelectOptionsAsArray(select))
    );
  }
  private handlers() {
    const deselectRowsHandler = () => {
      return this.deselectedAllRows.asObservable().pipe(
        switchMap(() => this.cancelButton$),
        this.unsubscribe.takeUntilDestroy
      );
    };
    const deleteRow = () => {
      return this.deleteRow.asObservable().pipe(
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
  ngAfterViewInit(): void {
    this.initIds();
    this.handlers();
    this._table
      .init(this.jsonTable, this.paginator, this.sort, this.createTableItem$)
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (e) => {},
        error: (e) => console.error(e),
      });
    this._table.applyFilter(['fullName']);
    this.userNo.disable();
  }
  resetForm(event: MouseEvent) {
    event.preventDefault();
    this._formGroup.setValue(this._copyFormGroup.value);
  }
  submitForm(event: MouseEvent) {
    event.preventDefault();
    const isUpdate = this._table.isSelected;
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
          concatMap(() => (isUpdate ? this.updateButton$ : this.createButton$))
        )
        .subscribe(this._dom.clickButton);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  get userNo$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.USER_NUMBER_TEXTFIELD
    );
  }
  get firstName$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.FIRST_NAME_TEXTFIELD
    );
  }
  get middleName$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.MIDDLE_NAME_TEXTFIELD
    );
  }
  get lastName$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.LAST_NAME_TEXTFIELD
    );
  }
  get designation$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      ECreateUserSetup.DESIGNATION_SELECT
    );
  }
  get mobileNo$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.MOBILE_NUMBER_TEXTFIELD
    );
  }
  get emailAddress$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.EMAIL_TEXTFIELD
    );
  }
  get branch$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      ECreateUserSetup.BRANCH_SELECT
    );
  }
  get feeAllocationStatuses$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        ECreateUserSetup.FEE_ALLOCATION_STATUS_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ECreateUserSetup.DELETE_BUTTON
    );
  }
  get userNo() {
    return this._formGroup.get('userNo') as FormControl;
  }
  get firstName() {
    return this._formGroup.get('firstName') as FormControl;
  }
  get middleName() {
    return this._formGroup.get('middleName') as FormControl;
  }
  get lastName() {
    return this._formGroup.get('lastName') as FormControl;
  }
  get designation() {
    return this._formGroup.get('designation') as FormControl;
  }
  get mobileNo() {
    return this._formGroup.get('mobileNo') as FormControl;
  }
  get emailAddress() {
    return this._formGroup.get('emailAddress') as FormControl;
  }
  get branch() {
    return this._formGroup.get('branch') as FormControl;
  }
  get feeAllocationStatus() {
    return this._formGroup.get('feeAllocationStatus') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
