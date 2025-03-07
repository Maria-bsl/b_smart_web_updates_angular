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
import { map, Observable, of, zip } from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import {
  TableSelectedPipe,
  BoldifyPipe,
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

export enum ESmsTextSetup {
  FLOW_SELECT,
  SUBJECT_TEXTFIELD,
  MESSAGE_TEXTFIELD,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum ESmsTextSetupItem {
  SELECTOR_BUTTON,
  SNO,
  INSTANCE,
  SUBJECT,
  MESSAGE,
}

export type SmsTextSetupItem = {
  selector?: HTMLInputElement;
  instance?: string;
  subject?: string;
  message?: string;
};

@Component({
    selector: 'app-sms-text-setup',
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
    templateUrl: './sms-text-setup.component.html',
    styleUrl: './sms-text-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class SmsTextSetupComponent implements AfterViewInit {
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
  private createTableItem$(item: KeyValuePair): Observable<SmsTextSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      ESmsTextSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const instance$ = tableItem.getTableItem$<string>(
      ESmsTextSetupItem.INSTANCE,
      (value: string) => value
    );
    const subject$ = tableItem.getTableItem$<string>(
      ESmsTextSetupItem.SUBJECT,
      (value: string) => value
    );
    const message$ = tableItem.getTableItem$<string>(
      ESmsTextSetupItem.MESSAGE,
      (value: string) => value
    );
    const zipped$ = zip(selector$, instance$, subject$, message$);
    return zipped$.pipe(
      map(([selector, instance, subject, message]) => {
        const item: SmsTextSetupItem = {
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
  get flow$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      ESmsTextSetup.FLOW_SELECT
    );
  }
  get subject$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmsTextSetup.SUBJECT_TEXTFIELD
    );
  }
  get message$() {
    return this._dom.getDomElement$<HTMLTextAreaElement>(
      this._ids$,
      ESmsTextSetup.MESSAGE_TEXTFIELD
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmsTextSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmsTextSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmsTextSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ESmsTextSetup.DELETE_BUTTON
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
