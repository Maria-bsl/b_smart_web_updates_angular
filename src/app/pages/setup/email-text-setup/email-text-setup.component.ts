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
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import {
  BoldifyPipe,
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
import { PasswordAgingSetupItem } from '../password-aging-setup/password-aging-setup.component';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';

export enum EEmailTextSetup {
  FLOW_SELECT,
  SUBJECT_TEXTFIELD,
  MESSAGE_TEXTFIELD,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EEmailTextSetupItem {
  SELECTOR_BUTTON,
  SNO,
  INSTANCE,
  SUBJECT,
  MESSAGE,
}

export type EmailTextSetupItem = {
  selector?: HTMLInputElement;
  instance?: string;
  subject?: string;
  message?: string;
};

@Component({
    selector: 'app-email-text-setup',
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
        BoldifyPipe,
    ],
    templateUrl: './email-text-setup.component.html',
    styleUrl: './email-text-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class EmailTextSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'instance',
    'subject',
    'message',
  ]);
  @Input('keys') keys: string = '';
  @Input('email-text-table') jsonTable: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  flowsList$!: Observable<HtmlSelectOption[]>;
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
  private createTableItem$(item: KeyValuePair): Observable<EmailTextSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EEmailTextSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const instance$ = tableItem.getTableItem$<string>(
      EEmailTextSetupItem.INSTANCE,
      (value: string) => value
    );
    const subject$ = tableItem.getTableItem$<string>(
      EEmailTextSetupItem.SUBJECT,
      (value: string) => value
    );
    const message$ = tableItem.getTableItem$<string>(
      EEmailTextSetupItem.MESSAGE,
      (value: string) => value
    );
    const zipped$ = zip(selector$, instance$, subject$, message$);
    return zipped$.pipe(
      map(([selector, instance, subject, message]) => {
        const item: EmailTextSetupItem = {
          selector: selector,
          instance: instance,
          subject: subject,
          message: message,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        flowId: this._fb.control('', [Validators.required]),
        subject: this._fb.control('', [Validators.required]),
        message: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, EEmailTextSetup);
    const controls: THtmlElementControls[] = [
      [this.flow$, this.flowId],
      [this.subject$, this.subject],
      [this.message$, this.message],
    ];
    const events = this._dom.registerFormControls(controls);
    events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      error: (e) => console.error(e),
      complete: () => this._copyFormGroup.setValue(this.formGroup.value),
    });
    this.flowsList$ = this.flow$.pipe(
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
    this._table.applyFilter(['instance']);
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
  get flow$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      EEmailTextSetup.FLOW_SELECT
    );
  }
  get subject$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EEmailTextSetup.SUBJECT_TEXTFIELD
    );
  }
  get message$() {
    return this._dom.getDomElement$<HTMLTextAreaElement>(
      this._ids$,
      EEmailTextSetup.MESSAGE_TEXTFIELD
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EEmailTextSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EEmailTextSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EEmailTextSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EEmailTextSetup.DELETE_BUTTON
    );
  }
  get flowId() {
    return this._formGroup.get('flowId') as FormControl;
  }
  get subject() {
    return this._formGroup.get('subject') as FormControl;
  }
  get message() {
    return this._formGroup.get('message') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
