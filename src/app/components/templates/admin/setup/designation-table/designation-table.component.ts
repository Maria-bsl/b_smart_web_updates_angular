import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, map, Observable, of, switchMap, tap, zip } from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { filterNotNull } from 'src/app/components/forms/admin/login-form/login-form.component';
import { EDesignationSetupItem } from 'src/app/core/enums/admin/setup/designation-setup.enum';
import { DesignationSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import {
  IsSelectedItemPipe,
  IsSelectedRowPipe,
} from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { TableItem } from 'src/app/shared/logic/table-item';

@Component({
  selector: 'app-designation-table',
  imports: [
    MatTableModule,
    CommonModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    TranslateModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    IsSelectedItemPipe,
  ],
  templateUrl: './designation-table.component.html',
  styleUrl: './designation-table.component.scss',
})
export class DesignationTableComponent implements AfterViewInit {
  headers$: Observable<string[]> = of(['selector', 'designation']);
  dataSource!: MatTableDataSource<DesignationSetupTableItem>;
  @Input() tableJson: string = '';
  selection = new SelectionModel<DesignationSetupTableItem>(false, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  constructor(
    private unsubscribe: UnsubscribeService,
    private _dom: ElementDomManipulationService
  ) {}
  private init() {
    const selectionHandler = () => {
      const onItemSelected = (item: DesignationSetupTableItem) => {
        console.log(item);
        item.selector && this._dom.clickButton(item.selector);
      };
      return this.dataSource
        .connect()
        .asObservable()
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          tap({
            next: (items) =>
              items.forEach((item) => {
                item.selector &&
                  item.selector.checked &&
                  this.selection.select(item);
              }),
            error: (err) => console.error(err),
          }),
          switchMap(() => this.selection.changed),
          tap({
            next: (selection) => {
              const selections = selection.source.selected;
              if (selections && selections.length > 0) {
                onItemSelected(selections[0]);
              } else {
                this.deselectedAllRows.emit();
              }
            },
            error: (err) => console.error(err),
          })
        );
    };
    const createAcademicSetupTableItem = (item: KeyValuePair) => {
      const tableItem = new TableItem(Object.values(item));
      const radioButton$ = tableItem.getTableItem$<HTMLInputElement>(
        EDesignationSetupItem.RADIO_BUTTON,
        (value: string) => document.getElementById(value) as HTMLInputElement
      );
      const designationName$ = tableItem.getTableItem$<string>(
        EDesignationSetupItem.DESIGNATION_NAME,
        (value: string) => value
      );
      const zipped$ = zip(radioButton$, designationName$);
      return zipped$.pipe(
        map(([radioButton, designationName]) => {
          const item: DesignationSetupTableItem = {
            selector: radioButton,
            designation: designationName,
          };
          return item;
        })
      );
    };
    const createAcademicSetupTableItems$ = (items: KeyValuePair[]) => {
      const observables = items
        .filter((m) => !!m)
        .map(createAcademicSetupTableItem);
      return combineLatest(observables);
    };
    const createDataSource = (list: DesignationSetupTableItem[]) => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      selectionHandler().subscribe({ error: (e) => console.error(e) });
    };
    try {
      if (!this.tableJson)
        throw Error('Designation setup: Table json is invalid.');
      const academicTable$ = createAcademicSetupTableItems$(
        JSON.parse(this.tableJson)
      );
      academicTable$
        .pipe(this.unsubscribe.takeUntilDestroy)
        .subscribe(createDataSource);
    } catch (error: any) {
      console.error(error);
      createAcademicSetupTableItems$([]);
    }
  }
  ngAfterViewInit(): void {
    this.init();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (
      data: DesignationSetupTableItem,
      value: string
    ) =>
      data.designation && data?.designation?.toLocaleLowerCase().includes(value)
        ? true
        : false;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onDeleteRowClicked(event: MouseEvent) {
    this.deleteRow.emit();
  }
  onCheckboxChange(row: DesignationSetupTableItem) {
    if (!this.selection.isSelected(row)) {
      this.selection.toggle(row); // Only select if it's not already selected
    }
  }
  checkboxLabel(row?: DesignationSetupTableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${this.dataSource?.data.find((item) => item === row)}`;
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
}
