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
import {
  ERegionSetup,
  ERegionSetupItem,
} from 'src/app/core/enums/admin/setup/region-setup.enum';
import { RegionSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
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

@Component({
<<<<<<< HEAD
    selector: 'app-region-setup',
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
    ],
    templateUrl: './region-setup.component.html',
    styleUrl: './region-setup.component.scss',
    animations: [inOutAnimation]
=======
  selector: 'app-region-setup',
  standalone: true,
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
  ],
  templateUrl: './region-setup.component.html',
  styleUrl: './region-setup.component.scss',
  animations: [inOutAnimation],
>>>>>>> eb465d57eeec39fca151ad86e20fd4337434531a
})
export class RegionSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'regionName',
    'countryName',
    'regionStatus',
  ]);
  @Input('keys') keys: string = '';
  @Input('region-table') jsonTable: string = '';
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  countries$!: Observable<HtmlSelectOption[]>;
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private languageService: LanguageService,
    private _table: TableDataService<RegionSetupTableItem>
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(
    item: KeyValuePair
  ): Observable<RegionSetupTableItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      ERegionSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const region$ = tableItem.getTableItem$<string>(
      ERegionSetupItem.REGION,
      (value: string) => value
    );
    const country$ = tableItem.getTableItem$<string>(
      ERegionSetupItem.COUNTRY,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      ERegionSetupItem.STATUS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, region$, country$, status$);
    return zipped$.pipe(
      map(([selector, region, country, status]) => {
        const item: RegionSetupTableItem = {
          selector: selector,
          regionName: region,
          countryName: country,
          regionStatus: status,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        region: this._fb.control('', [Validators.required]),
        country: this._fb.control('', [Validators.required]),
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
        [this.region$, this.region],
        [this.country$, this.country],
        [this.regionStatuses$, this.status],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    const populateForms = () => {
      this.countries$ = this.country$.pipe(
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
    this._table.applyFilter(['regionName', 'countryName']);
  }
  resetForm(event: MouseEvent) {
    event.preventDefault();
    this._formGroup.setValue(this._copyFormGroup.value);
  }
  submitForm(event: MouseEvent) {
    event.preventDefault();
    const isUpdate = this._table.selection.hasValue();
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
  get formGroup() {
    return this._formGroup;
  }
  get region$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ERegionSetup.REGION_TEXTFIELD
    );
  }
  get regionStatuses$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        ERegionSetup.REGION_RADIO_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el.querySelectorAll('input[type="radio"]'))
      );
  }
  get country$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      ERegionSetup.COUNTRY_SELECT
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ERegionSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ERegionSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ERegionSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ERegionSetup.DELETE_BUTTON
    );
  }
  get region() {
    return this._formGroup.get('region') as FormControl;
  }
  get country() {
    return this._formGroup.get('country') as FormControl;
  }
  get status() {
    return this._formGroup.get('status') as FormControl;
  }
  get tableService() {
    return this._table;
  }
}
