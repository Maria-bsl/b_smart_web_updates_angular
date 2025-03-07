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
import { PasswordAgingSetupItem } from '../password-aging-setup/password-aging-setup.component';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';

export enum ESmtpSettingsSetup {
  FROM_EMAIL_ADDRESS_TEXTFIELD,
  SSL_ENABLED_TEXTFIELD,
  SMTP_ADDRESS_TEXTFIELD,
  SMTP_PORT_ADDRESS_TEXTFIELD,
  SMTP_USERNAME_TEXTFIELD,
  SMTP_PASSWORD_TEXTFIELD,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum ESmtpSettingsSetupItem {
  SELECTOR_BUTTON,
  FROM_EMAIL_ADDRESS,
  SNO,
  SMTP_ADDRESS,
}

export type SmtpSettingsSetupItem = {
  selector?: HTMLInputElement;
  fromEmailAddress?: string;
  smtpAddress?: string;
};

@Component({
    selector: 'app-smtp-settings-setup',
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
    templateUrl: './smtp-settings-setup.component.html',
    styleUrl: './smtp-settings-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class SmtpSettingsSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'fromEmailAddress',
    'smtpAddress',
  ]);
  @Input('keys') keys: string = '';
  @Input('smtp-settings-table') jsonTable: string = '';
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
    private _cdr: ChangeDetectorRef,
    private _table: TableDataService<PasswordAgingSetupItem>,
    private languageService: LanguageService
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(
    item: KeyValuePair
  ): Observable<SmtpSettingsSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      ESmtpSettingsSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const fromAddress$ = tableItem.getTableItem$<string>(
      ESmtpSettingsSetupItem.FROM_EMAIL_ADDRESS,
      (value: string) => value
    );
    const smtpAddress$ = tableItem.getTableItem$<string>(
      ESmtpSettingsSetupItem.SMTP_ADDRESS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, fromAddress$, smtpAddress$);
    return zipped$.pipe(
      map(([selector, fromAddress, smtpAddress]) => {
        const item: SmtpSettingsSetupItem = {
          selector: selector,
          fromEmailAddress: fromAddress,
          smtpAddress: smtpAddress,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        emailFromAddress: this._fb.control('', [Validators.required]),
        sslEnabled: this._fb.control('', [Validators.required]),
        smtpAddress: this._fb.control('', [Validators.required]),
        smtpPortAddress: this._fb.control('', [Validators.required]),
        smtpUsername: this._fb.control('', []),
        smtpPassword: this._fb.control('', []),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, ESmtpSettingsSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.fromEmailAddress$, this.emailFromAddress],
        [this.sslEnabled$, this.sslEnabled],
        [this.smtpAddress$, this.smtpAddress],
        [this.smtpPort$, this.smtpPortAddress],
        [this.smtpUsername$, this.smtpUsername],
        [this.smtpPassword$, this.smtpPassword],
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
    this._table.applyFilter(['fromEmailAddress']);
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
  get fromEmailAddress$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.FROM_EMAIL_ADDRESS_TEXTFIELD
    );
  }
  get sslEnabled$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        ESmtpSettingsSetup.SSL_ENABLED_TEXTFIELD
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get smtpAddress$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.SMTP_ADDRESS_TEXTFIELD
    );
  }
  get smtpPort$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.SMTP_PORT_ADDRESS_TEXTFIELD
    );
  }
  get smtpUsername$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.SMTP_USERNAME_TEXTFIELD
    );
  }
  get smtpPassword$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.SMTP_PASSWORD_TEXTFIELD
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmtpSettingsSetup.DELETE_BUTTON
    );
  }
  get emailFromAddress() {
    return this._formGroup.get('emailFromAddress') as FormControl;
  }
  get sslEnabled() {
    return this._formGroup.get('sslEnabled') as FormControl;
  }
  get smtpAddress() {
    return this._formGroup.get('smtpAddress') as FormControl;
  }
  get smtpPortAddress() {
    return this._formGroup.get('smtpPortAddress') as FormControl;
  }
  get smtpUsername() {
    return this._formGroup.get('smtpUsername') as FormControl;
  }
  get smtpPassword() {
    return this._formGroup.get('smtpPassword') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
