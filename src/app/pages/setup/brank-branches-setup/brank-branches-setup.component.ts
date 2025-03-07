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
import { concatMap, map, Observable, of, switchMap, zip } from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { WardSetupTableItem } from '../ward-setup/ward-setup.component';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { TermSetupItem } from '../term-setup/term-setup.component';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { TableSelectedPipe } from 'src/app/core/pipes/tables/table-selected.pipe';

export enum EBankBranchesSetup {
  ZONE_SELECT,
  BRANCH_TEXTFIELD,
  BRANCH_STATUS_BUTTONS,
  LOCATION_TEXTFIELD,
  CITY_TEXTFIELD,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum EBankBranchesSetupItem {
  SELECTOR_BUTTON,
  BRANCH_NAME,
  BRANCH_SNO,
  LOCATION,
  CITY,
  BRANCH_STATUS,
}

export type BankBranchesSetup = {
  selector?: HTMLInputElement;
  branchName?: string;
  location?: string;
  city?: string;
  branchStatus?: string;
};

@Component({
    selector: 'app-brank-branches-setup',
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
    templateUrl: './brank-branches-setup.component.html',
    styleUrl: './brank-branches-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class BrankBranchesSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'branchName',
    'location',
    'city',
    'status',
  ]);
  @Input('keys') keys: string = '';
  @Input('branches-table') jsonTable: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  // private _table: TableDataService<WardSetupTableItem> = new TableDataService(
  //   this._dom,
  //   this.unsubscribe
  // );
  zones$!: Observable<HtmlSelectOption[]>;
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private languageService: LanguageService,
    private _table: TableDataService<WardSetupTableItem>
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(item: KeyValuePair): Observable<TermSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      EBankBranchesSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const branch$ = tableItem.getTableItem$<string>(
      EBankBranchesSetupItem.BRANCH_NAME,
      (value: string) => value
    );
    const location$ = tableItem.getTableItem$<string>(
      EBankBranchesSetupItem.LOCATION,
      (value: string) => value
    );
    const city$ = tableItem.getTableItem$<string>(
      EBankBranchesSetupItem.CITY,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      EBankBranchesSetupItem.BRANCH_STATUS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, branch$, location$, city$, status$);
    return zipped$.pipe(
      map(([selector, branch, location, city, status]) => {
        const item: BankBranchesSetup = {
          selector: selector,
          branchName: branch,
          location: location,
          city: city,
          branchStatus: status,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        zone: this._fb.control('', [Validators.required]),
        branchName: this._fb.control('', [Validators.required]),
        branchStatus: this._fb.control('', [Validators.required]),
        location: this._fb.control('', [Validators.required]),
        city: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, EBankBranchesSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.zone$, this.zone],
        [this.branchName$, this.branchName],
        [this.branchStatuses$, this.branchStatus],
        [this.location$, this.location],
        [this.city$, this.city],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    this.zones$ = this.zone$.pipe(
      map((select) => this._dom.getSelectOptionsAsArray(select))
    );
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
        error: (e) => console.error(e),
      });
    this._table.applyFilter(['branchName']);
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
          concatMap(() => (isUpdate ? this.updateButton$ : this.createButton$))
        )
        .subscribe(this._dom.clickButton);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  get city$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.CITY_TEXTFIELD
    );
  }
  get location$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.LOCATION_TEXTFIELD
    );
  }
  get branchStatuses$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        EBankBranchesSetup.BRANCH_STATUS_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get branchName$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.BRANCH_TEXTFIELD
    );
  }
  get zone$() {
    return this._dom.getDomElement$<HTMLSelectElement>(
      this._ids$,
      EBankBranchesSetup.ZONE_SELECT
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EBankBranchesSetup.DELETE_BUTTON
    );
  }
  get zone() {
    return this._formGroup.get('zone') as FormControl;
  }
  get branchName() {
    return this._formGroup.get('branchName') as FormControl;
  }
  get branchStatus() {
    return this._formGroup.get('branchStatus') as FormControl;
  }
  get location() {
    return this._formGroup.get('location') as FormControl;
  }
  get city() {
    return this._formGroup.get('city') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
