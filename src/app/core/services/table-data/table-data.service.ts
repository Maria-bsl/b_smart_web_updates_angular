import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  BehaviorSubject,
  combineLatest,
  combineLatestWith,
  concatMap,
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { KeyValuePair, TableHeader } from '../../interfaces/table-format';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { ElementDomManipulationService } from '../dom-manipulation/element-dom-manipulation.service';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';

@Injectable({
  providedIn: 'root',
})
export class TableDataService<T> {
  private _dataSource = new MatTableDataSource<T>([]);
  private _selection = new SelectionModel<T>(false, []);
  private _searchControl = new FormControl<string>('', []);
  constructor(
    private _dom: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService
  ) {}
  init(
    tableJson: string,
    paginator: MatPaginator,
    sort: MatSort,
    createItem$: (item: KeyValuePair) => Observable<T>
  ) {
    type SelectableTable = { selector?: HTMLInputElement };
    const createTableList$ = (items: KeyValuePair[]) => {
      const observables = items.filter((m) => !!m).map(createItem$);
      return combineLatest(observables);
    };
    const createDataSource = (list: T[]) => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = paginator;
      this.dataSource.sort = sort;
    };
    const selectRow = (list: T[]) => {
      const rows = list.filter(
        (item) =>
          (item as SelectableTable).selector &&
          (item as SelectableTable).selector?.checked
      );
      rows.length > 0 && !!rows[0] && this.selection.select(rows[0]);
    };
    const selectionChanged = (selection: SelectionChange<T>) =>
      selection.source.selected.length > 0 &&
      !!(selection.source.selected[0] as SelectableTable)?.selector &&
      this._dom.clickButton(
        (selection.source.selected[0] as SelectableTable)?.selector!
      );
    try {
      if (!tableJson) throw Error('Academic setup: Table json is invalid.');
      const academicTable$ = createTableList$(JSON.parse(tableJson));
      return academicTable$.pipe(
        tap(createDataSource),
        concatMap(() => this.dataSource.connect().asObservable().pipe(take(1))),
        tap(selectRow),
        concatMap(() =>
          this.selection.changed.pipe(tap(selectionChanged), take(1))
        )
      );
    } catch (error: any) {
      console.error(error);
      return of();
    }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource?.data);
  }
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${this.dataSource?.data.find((item) => item === row)}`;
  }
  onSelect(row: T) {
    if (!this.selection.isSelected(row)) {
      this.selection.clear(); // Ensure only one row is selected
      this.selection.select(row); // Select the new row
    }
  }
  onMultipleSelect(row: T) {
    this.selection.toggle(row);
  }
  onCheckboxChange(row: T) {
    if (!this.selection.isSelected(row)) {
      this.selection.toggle(row); // Only select if it's not already selected
    }
  }
  applyFilter(keys: string[]) {
    const searchValues = (item: T, searchableKeys: string[]) => {
      const map = new Map<string, string>(Object.entries(item as {}));
      return searchableKeys
        .map((key) => map.get(key))
        .filter((value) => value !== null && value !== undefined);
    };
    const match = (data: T, value: string) => {
      const searches = searchValues(data, keys);
      return searches.some((search) =>
        search?.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      );
    };
    this.dataSource.filterPredicate = match;
    this.searchControl.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe(
        (value) =>
          (this.dataSource.filter = value) &&
          this.dataSource.paginator &&
          this.dataSource.paginator.firstPage()
      );
  }
  set searchControl(searchControl: FormControl) {
    this._searchControl = searchControl;
  }
  set selection(selection: SelectionModel<T>) {
    this._selection = selection;
  }
  set dataSource(dataSource: MatTableDataSource<T>) {
    this._dataSource = dataSource;
  }
  get dataSource() {
    return this._dataSource;
  }
  get selection() {
    return this._selection;
  }
  get searchControl() {
    return this._searchControl;
  }
}
