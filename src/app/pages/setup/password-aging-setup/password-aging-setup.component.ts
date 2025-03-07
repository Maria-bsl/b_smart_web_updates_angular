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
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { TableSelectedPipe } from 'src/app/core/pipes/tables/table-selected.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { FeeTypeSetup } from '../fee-type-setup/fee-type-setup.component';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';

export enum EPasswordAgingSetup {
  PASSWORD_LIFE_DAYS_TEXTFIELD,
  NOTIFICATION_ALERT_TEXTFIELD,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EPasswordAgingSetupItem {
  SELECTOR_BUTTON,
  PASSWORD_LIFE_DAYS,
  NOTIFICATION_ALERT_DAYS,
  SNO,
  POSTED_DATE,
}

export type PasswordAgingSetupItem = {
  selector?: HTMLInputElement;
  passwordLifeDays?: string;
  notificationAlertDays?: string;
  postedDate?: string;
};

@Component({
    selector: 'app-password-aging-setup',
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
        TableSelectedPipe,
    ],
    templateUrl: './password-aging-setup.component.html',
    styleUrl: './password-aging-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class PasswordAgingSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'passwordLifeDays',
    'notificationAlertDays',
    'postedDate',
  ]);
  @Input('keys') keys: string = '';
  @Input('password-aging-table') jsonTable: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private languageService: LanguageService,
    private _cdr: ChangeDetectorRef,
    private _table: TableDataService<PasswordAgingSetupItem>
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(
    item: KeyValuePair
  ): Observable<PasswordAgingSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EPasswordAgingSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const passwordLifeDays$ = tableItem.getTableItem$<string>(
      EPasswordAgingSetupItem.PASSWORD_LIFE_DAYS,
      (value: string) => value
    );
    const notificationAlertDays$ = tableItem.getTableItem$<string>(
      EPasswordAgingSetupItem.NOTIFICATION_ALERT_DAYS,
      (value: string) => value
    );
    const postedDate$ = tableItem.getTableItem$<string>(
      EPasswordAgingSetupItem.POSTED_DATE,
      (value: string) => value
    );
    const zipped$ = zip(
      selector$,
      passwordLifeDays$,
      notificationAlertDays$,
      postedDate$
    );
    return zipped$.pipe(
      map(([selector, passwordLifeDays, notificationAlertDays, postedDate]) => {
        const item: PasswordAgingSetupItem = {
          selector: selector,
          passwordLifeDays: passwordLifeDays,
          notificationAlertDays: notificationAlertDays,
          postedDate: postedDate,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        passwordLifeDays: this._fb.control('', [Validators.required]),
        notificationAlertDays: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, EPasswordAgingSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.passwordLifeDays$, this.passwordLifeDays],
        [this.notificationAlertDays$, this.notificationAlertDays],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    registerControls();
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
    this._table.applyFilter(['passwordLifeDays']);
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
  get passwordLifeDays$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EPasswordAgingSetup.PASSWORD_LIFE_DAYS_TEXTFIELD
    );
  }
  get notificationAlertDays$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EPasswordAgingSetup.NOTIFICATION_ALERT_TEXTFIELD
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EPasswordAgingSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EPasswordAgingSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EPasswordAgingSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EPasswordAgingSetup.DELETE_BUTTON
    );
  }
  get passwordLifeDays() {
    return this._formGroup.get('passwordLifeDays') as FormControl;
  }
  get notificationAlertDays() {
    return this._formGroup.get('notificationAlertDays') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
