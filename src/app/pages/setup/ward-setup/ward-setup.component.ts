import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
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
import { map, Observable, of, switchMap, zip } from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
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

export enum EWardSetup {
  WARD_TEXTFIELD,
  WARD_STATUS_BUTTONS,
  DISTRICT_SELECT,
  REGION_SELECT,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EWardSetupItem {
  SELECTOR_BUTTON,
  WARD,
  SNO,
  DISTRICT,
  REGION,
  STATUS,
}

export type WardSetupTableItem = {
  selector?: HTMLInputElement;
  wardName?: string;
  regionName?: string;
  districtName?: string;
  wardStatus?: string;
};

@Component({
    selector: 'app-ward-setup',
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
    templateUrl: './ward-setup.component.html',
    styleUrl: './ward-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class WardSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'wardName',
    'regionName',
    'districtName',
    'wardStatus',
  ]);
  @Input('keys') keys: string = '';
  @Input('ward-table') jsonTable: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  regionsList$!: Observable<HtmlSelectOption[]>;
  districtsList$!: Observable<HtmlSelectOption[]>;
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  // private _table: TableDataService<WardSetupTableItem> = new TableDataService(
  //   this._dom,
  //   this.unsubscribe
  // );
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private _table: TableDataService<WardSetupTableItem>,
    private languageService: LanguageService
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(item: KeyValuePair): Observable<WardSetupTableItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EWardSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const ward$ = tableItem.getTableItem$<string>(
      EWardSetupItem.WARD,
      (value: string) => value
    );
    const region$ = tableItem.getTableItem$<string>(
      EWardSetupItem.REGION,
      (value: string) => value
    );
    const district$ = tableItem.getTableItem$<string>(
      EWardSetupItem.DISTRICT,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      EWardSetupItem.STATUS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, ward$, region$, district$, status$);
    return zipped$.pipe(
      map(([selector, ward, region, district, status]) => {
        const item: WardSetupTableItem = {
          selector: selector,
          wardName: ward,
          regionName: region,
          districtName: district,
          wardStatus: status,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        ward: this._fb.control('', [Validators.required]),
        region: this._fb.control('', [Validators.required]),
        district: this._fb.control('', [Validators.required]),
        status: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, EWardSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.ward$, this.ward],
        [this.regions$, this.region],
        [this.districts$, this.district],
        [this.wardStatuses$, this.status],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    const populateForms = () => {
      this.regionsList$ = this.regions$.pipe(
        map((select) => this._dom.getSelectOptionsAsArray(select))
      );
      this.districtsList$ = this.districts$.pipe(
        map((select) => this._dom.getSelectOptionsAsArray(select))
      );
    };
    registerControls();
    populateForms();
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
        error: (e) => console.error(e),
      });
    this._table.applyFilter(['wardName', 'districtName']);
    this.region.disable();
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
          switchMap(() => (isUpdate ? this.updateButton$ : this.createButton$))
        )
        .subscribe(this._dom.clickButton);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  get ward$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EWardSetup.WARD_TEXTFIELD
    );
  }
  get regions$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      EWardSetup.REGION_SELECT
    );
  }
  get districts$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      EWardSetup.DISTRICT_SELECT
    );
  }
  get wardStatuses$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        EWardSetup.WARD_STATUS_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EWardSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EWardSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EWardSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EWardSetup.DELETE_BUTTON
    );
  }
  get ward() {
    return this._formGroup.get('ward') as FormControl;
  }
  get region() {
    return this._formGroup.get('region') as FormControl;
  }
  get district() {
    return this._formGroup.get('district') as FormControl;
  }
  get status() {
    return this._formGroup.get('status') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
