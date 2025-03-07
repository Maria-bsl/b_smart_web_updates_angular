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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  concatMap,
  delay,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
  zip,
} from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { WardSetupTableItem } from '../ward-setup/ward-setup.component';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { TableItem } from 'src/app/shared/logic/table-item';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { THtmlElementControls } from 'src/app/core/services/admin/setup/academic/academic.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { RegionSetupTableComponent } from 'src/app/components/templates/admin/setup/region-setup-table/region-setup-table.component';
import { ZoneSetupTableComponent } from 'src/app/components/templates/admin/setup/zone-setup-table/zone-setup-table.component';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { SelectionChange } from '@angular/cdk/collections';
import { TableSelectedPipe } from 'src/app/core/pipes/tables/table-selected.pipe';

export enum ETermSetup {
  TERM_TEXTFIELD,
  TERM_STATUS_BUTTONS,
  CREATE_BUTTON,
  UPDATE_BUTTON,
  DELETE_BUTTON,
  CANCEL_BUTTON,
}

export enum ETermSetupItem {
  SELECTOR_BUTTON,
  TERM,
  SNO,
  STATUS,
}

export type TermSetupItem = {
  selector?: HTMLInputElement;
  termName?: string;
  termStatus?: string;
};

@Component({
    selector: 'app-term-setup',
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
    templateUrl: './term-setup.component.html',
    styleUrl: './term-setup.component.scss',
    animations: [inOutAnimation],
    providers: [TableDataService]
})
export class TermSetupComponent implements AfterViewInit {
  headers$: Observable<string[]> = of(['selector', 'termName', 'termStatus']);
  @Input('keys') keys: string = '';
  @Input('term-table') jsonTable: string = '';
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  private _dataSource = new MatTableDataSource<TermSetupItem>([]);
  // private _table: TableDataService<TermSetupItem> = new TableDataService(
  //   this._dom,
  //   this.unsubscribe
  // );
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder,
    private languageService: LanguageService,
    private _table: TableDataService<TermSetupItem>,
    private _cdr: ChangeDetectorRef
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createTableItem$(item: KeyValuePair): Observable<TermSetupItem> {
    const tableItem = new TableItem(Object.values(item));
    const selector$ = tableItem.getTableItem$<HTMLInputElement>(
      ETermSetupItem.SELECTOR_BUTTON,
      (value: string) => document.getElementById(value) as HTMLInputElement
    );
    const term$ = tableItem.getTableItem$<string>(
      ETermSetupItem.TERM,
      (value: string) => value
    );
    const status$ = tableItem.getTableItem$<string>(
      ETermSetupItem.STATUS,
      (value: string) => value
    );
    const zipped$ = zip(selector$, term$, status$);
    return zipped$.pipe(
      map(([selector, term, status]) => {
        const item: TermSetupItem = {
          selector: selector,
          termName: term,
          termStatus: status,
        };
        return item;
      })
    );
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        termName: this._fb.control('', [Validators.required]),
        termStatus: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds() {
    this._ids$ = this._dom.createIds(this.keys, ETermSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.term$, this.termName],
        [this.termStatuses$, this.termStatus],
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
    const selectionChanged = (selection: SelectionChange<TermSetupItem>) =>
      selection.source.selected.length > 0 &&
      !!(selection.source.selected[0] as TermSetupItem)?.selector &&
      this._dom.clickButton(
        (selection.source.selected[0] as TermSetupItem)?.selector!
      );
    this.initIds();
    this.handlers();
    this._dataSource.paginator = this.paginator;
    this._dataSource.sort = this.sort;
    this._table
      .init(this.jsonTable, this.paginator, this.sort, this.createTableItem$)
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (e) => {
          if (this._table.isSelected) {
            this.termName.disable();
            //this.termStatus.disable();
          }
        },
        error: (e) => console.error(e),
      });
    this._table.applyFilter(['termName']);
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
  get term$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ETermSetup.TERM_TEXTFIELD
    );
  }
  get termStatuses$(): Observable<NodeListOf<HTMLInputElement>> {
    return this._dom
      .getDomElement$<HTMLSpanElement>(
        this._ids$,
        ETermSetup.TERM_STATUS_BUTTONS
      )
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((el) => el && el.querySelectorAll('input[type="radio"]'))
      );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ETermSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ETermSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ETermSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      ETermSetup.DELETE_BUTTON
    );
  }
  get termName() {
    return this._formGroup.get('termName') as FormControl;
  }
  get termStatus() {
    return this._formGroup.get('termStatus') as FormControl;
  }
  get formGroup() {
    return this._formGroup;
  }
  get tableService() {
    return this._table;
  }
}
