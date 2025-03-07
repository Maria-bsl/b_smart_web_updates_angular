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
import { ERegionSetup } from 'src/app/core/enums/admin/setup/region-setup.enum';
import { RegionSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
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

export enum EDistrictSetup {
  DISTRICT_TEXTFIELD,
  DISTRICT_STATUS_RADIO_BUTTONS,
  DISTRICT_REGION_SELECT,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EDistrictSetupItem {
  SELECTOR_BUTTON,
  DISTRICT,
  SNO,
  REGION,
  STATUS,
}

export type DistrictSetupTableItem = {
  selector?: HTMLInputElement;
  districtName?: string;
  regionName?: string;
  districtStatus?: string;
};

@Component({
    selector: 'app-district-setup',
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
    templateUrl: './district-setup.component.html',
    styleUrl: './district-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class DistrictSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'districtName',
    'regionName',
    'districtStatus',
  ]);
  @Input('keys') keys: string = '';
  @Input('district-table') jsonTable: string = '';
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  regionsList$!: Observable<HtmlSelectOption[]>;
  // private _table: TableDataService<DistrictSetupTableItem> =
  //   new TableDataService(this._dom, this.unsubscribe);
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private languageService: LanguageService,
    private _table: TableDataService<DistrictSetupTableItem>
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(
    item: KeyValuePair
  ): Observable<DistrictSetupTableItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EDistrictSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const district$ = tableItem.getTableItem$<string>(
      EDistrictSetupItem.DISTRICT,
      (value: string) => value
    );
    const region$ = tableItem.getTableItem$<string>(
      EDistrictSetupItem.REGION,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      EDistrictSetupItem.STATUS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, district$, region$, status$);
    return zipped$.pipe(
      map(([selector, district, region, status]) => {
        const item: DistrictSetupTableItem = {
          selector: selector,
          regionName: region,
          districtName: district,
          districtStatus: status,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        district: this._fb.control('', [Validators.required]),
        region: this._fb.control('', [Validators.required]),
        status: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, ERegionSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.district$, this.district],
        [this.region$, this.region],
        [this.districtStatuses$, this.status],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    const populateForms = () => {
      this.regionsList$ = this.region$.pipe(
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
    this._table.applyFilter(['regionName', 'districtName']);
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
  get district$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDistrictSetup.DISTRICT_TEXTFIELD
    );
  }
  get districtStatuses$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        EDistrictSetup.DISTRICT_STATUS_RADIO_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get region$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      EDistrictSetup.DISTRICT_REGION_SELECT
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDistrictSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDistrictSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDistrictSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDistrictSetup.DELETE_BUTTON
    );
  }
  get district() {
    return this._formGroup.get('district') as FormControl;
  }
  get region() {
    return this._formGroup.get('region') as FormControl;
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
