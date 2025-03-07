import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  concatMap,
  map,
  Observable,
  of,
  switchMap,
  throwError,
  zip,
} from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { DesignationTableItemComponent } from 'src/app/components/components/designation-table-item/designation-table-item.component';
import { ProgressTableItemComponent } from 'src/app/components/components/progress-table-item/progress-table-item.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import {
  ListCheckboxesPipe,
  TableSelectedPipe,
} from 'src/app/core/pipes/tables/table-selected.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { CreateUserSetupItem } from '../create-user-setup/create-user-setup.component';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';

export enum EAccessModuleSetup {
  SCHOOL_SELECT,
  MODULES_CHECKBOXES,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EAccessModuleSetupItem {
  SELECTOR_BUTTON,
  SCHOOL_NAME,
  SCHOOL_SNO,
  MODULE_NAMES,
}

export type AccessModuleSetup = {
  selector?: HTMLInputElement;
  schoolName?: string;
  moduleNames?: string;
};

export type TCheckboxLabel = [HTMLInputElement, HTMLLabelElement];

@Component({
    selector: 'app-access-modules-setup',
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
        MatCheckboxModule,
        ActiveInactiveComponent,
        IsSelectedItemPipe,
        HasFormControlErrorPipe,
        TableSelectedPipe,
        DesignationTableItemComponent,
        ProgressTableItemComponent,
        ListCheckboxesPipe,
    ],
    templateUrl: './access-modules-setup.component.html',
    styleUrl: './access-modules-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class AccessModulesSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of(['selector', 'schoolName', 'modules']);
  @Input('keys') keys: string = '';
  @Input('access-modules-table') jsonTable: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  schoolList$!: Observable<HtmlSelectOption[]>;
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private _table: TableDataService<CreateUserSetupItem>,
    private languageService: LanguageService
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(item: KeyValuePair): Observable<AccessModuleSetup> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EAccessModuleSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const schoolName$ = tableItem.getTableItem$<string>(
      EAccessModuleSetupItem.SCHOOL_NAME,
      (value: string) => value
    );
    const moduleNames$ = tableItem.getTableItem$<string>(
      EAccessModuleSetupItem.MODULE_NAMES,
      (value: string) => value
    );
    const zipped$ = zip(selector$, schoolName$, moduleNames$);
    return zipped$.pipe(
      map(([selector, schoolName, moduleNames]) => {
        const item: AccessModuleSetup = {
          selector: selector,
          schoolName: schoolName,
          moduleNames: moduleNames,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        schoolName: this._fb.control('', [Validators.required]),
        moduleNames: this._fb.array<FormControl<TCheckboxLabel | null>>([], []),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, EAccessModuleSetup);
    const controls: THtmlElementControls[] = [
      [this.schoolName$, this.schoolName],
      //[this.moduleNames$, this.moduleNames],
    ];
    const events = this._dom.registerFormControls(controls);
    events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      error: (e) => console.error(e),
      complete: () => this._copyFormGroup.setValue(this.formGroup.value),
    });
    this.schoolList$ = this.schoolName$.pipe(
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
    this._table.applyFilter(['schoolName']);
    if (this._table.isSelected) {
      this.schoolName.disable();
      //this.mediumStatus.disable();
    }
    this.moduleNames$.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (res) => {
        const controls = res.map((item) =>
          this._fb.control<TCheckboxLabel | null>(item ?? null, [])
        );
        this.moduleNames.controls = [...controls];
      },
      error: (e) => console.error(e),
    });
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
  get schoolName$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      EAccessModuleSetup.SCHOOL_SELECT
    );
  }
  get moduleNames$(): Observable<TCheckboxLabel[]> {
    return this._dom.getDomElementCheckboxes(
      this._ids$,
      EAccessModuleSetup.MODULES_CHECKBOXES
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAccessModuleSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAccessModuleSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAccessModuleSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EAccessModuleSetup.DELETE_BUTTON
    );
  }
  get schoolName() {
    return this._formGroup.get('schoolName') as FormControl;
  }
  get moduleNames() {
    return this._formGroup.get('moduleNames') as FormArray<
      FormControl<TCheckboxLabel | null>
    >;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
