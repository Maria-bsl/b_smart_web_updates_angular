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
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import {
  concatMap,
  delay,
  map,
  Observable,
  of,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { WardSetupTableItem } from '../ward-setup/ward-setup.component';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';
import { TableSelectedPipe } from 'src/app/core/pipes/tables/table-selected.pipe';

export enum EFeeTypeSetup {
  FEE_TYPE_TEXTFIELD,
  FEE_TYPE_STATUS_BUTTONS,
  FEE_TYPE_DESCRIPTION_TEXTFIELD,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EFeeTypeSetupItem {
  SELECTOR_BUTTON,
  FEE_TYPE,
  FEE_TYPE_SNO,
  FEE_TYPE_DESCRIPTION,
  FEE_TYPE_STATUS,
}

export type FeeTypeSetup = {
  selector?: HTMLInputElement;
  feeType?: string;
  description?: string;
  status?: string;
};

@Component({
    selector: 'app-fee-type-setup',
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
    templateUrl: './fee-type-setup.component.html',
    styleUrl: './fee-type-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class FeeTypeSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'feeType',
    'description',
    'status',
  ]);
  @Input('keys') keys: string = '';
  @Input('fee-type-table') jsonTable: string = '';
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
    private _table: TableDataService<FeeTypeSetup>
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
    //this._table = new TableDataService(this._dom, this.unsubscribe);
  }
  private createTableItem$(item: KeyValuePair): Observable<FeeTypeSetup> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EFeeTypeSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const feeType$ = tableItem.getTableItem$<string>(
      EFeeTypeSetupItem.FEE_TYPE,
      (value: string) => value
    );
    const description$ = tableItem.getTableItem$<string>(
      EFeeTypeSetupItem.FEE_TYPE_DESCRIPTION,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      EFeeTypeSetupItem.FEE_TYPE_STATUS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, feeType$, description$, status$);
    return zipped$.pipe(
      map(([selector, feeType, description, status]) => {
        const item: FeeTypeSetup = {
          selector: selector,
          feeType: feeType,
          description: description,
          status: status,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        feeType: this._fb.control('', [Validators.required]),
        feeTypeDescription: this._fb.control('', [Validators.required]),
        feeTypeStatus: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, EFeeTypeSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.feeType$, this.feeType],
        [this.feeTypeDescription$, this.feeTypeDescription],
        [this.feeTypeStatus$, this.feeTypeStatus],
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
    this._table.applyFilter(['feeType']);
    if (this._table.isSelected) {
      this.feeType.disable();
      this.feeTypeDescription.disable();
      //this.feeTypeStatus.disable();
    }
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
  get feeType$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EFeeTypeSetup.FEE_TYPE_TEXTFIELD
    );
  }
  get feeTypeDescription$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EFeeTypeSetup.FEE_TYPE_DESCRIPTION_TEXTFIELD
    );
  }
  get feeTypeStatus$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        EFeeTypeSetup.FEE_TYPE_STATUS_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EFeeTypeSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EFeeTypeSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EFeeTypeSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EFeeTypeSetup.DELETE_BUTTON
    );
  }
  get feeType() {
    return this._formGroup.get('feeType') as FormControl;
  }
  get feeTypeDescription() {
    return this._formGroup.get('feeTypeDescription') as FormControl;
  }
  get feeTypeStatus() {
    return this._formGroup.get('feeTypeStatus') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
