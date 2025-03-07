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
import { EZoneSetupItem } from 'src/app/core/enums/admin/setup/zone-setup.enum';
import { ZoneSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import {
  IsSelectedItemPipe,
  IsSelectedRowPipe,
} from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { TableItem } from 'src/app/shared/logic/table-item';

@Component({
<<<<<<< HEAD
    selector: 'app-zone-setup-table',
    imports: [
        MatTableModule,
        CommonModule,
        MatCheckboxModule,
        MatRadioModule,
        FormsModule,
        TranslateModule,
        ActiveInactiveComponent,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        IsSelectedItemPipe,
    ],
    templateUrl: './zone-setup-table.component.html',
    styleUrl: './zone-setup-table.component.scss'
=======
  selector: 'app-zone-setup-table',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    TranslateModule,
    ActiveInactiveComponent,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    IsSelectedItemPipe,
  ],
  templateUrl: './zone-setup-table.component.html',
  styleUrl: './zone-setup-table.component.scss',
>>>>>>> eb465d57eeec39fca151ad86e20fd4337434531a
})
export class ZoneSetupTableComponent implements AfterViewInit {
  headers$: Observable<string[]> = of(['selector', 'zoneName', 'zoneStatus']);
  dataSource!: MatTableDataSource<ZoneSetupTableItem>;
  @Input() tableJson: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<ZoneSetupTableItem>(false, []);
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  constructor(
    private unsubscribe: UnsubscribeService,
    private _dom: ElementDomManipulationService
  ) {}
  private init() {
    const createTableItem = (item: KeyValuePair) => {
      const tableItem = new TableItem(Object.values(item));
      const radioButton$ = tableItem.getTableItem$<HTMLInputElement>(
        EZoneSetupItem.RADIO_BUTTON,
        (value: string) => document.getElementById(value) as HTMLInputElement
      );
      const academicYear$ = tableItem.getTableItem$<string>(
        EZoneSetupItem.ZONE_NAME,
        (value: string) => value
      );
      const academicStatus$ = tableItem.getTableItem$<string>(
        EZoneSetupItem.ZONE_STATUS,
        (value: string) => value
      );
      const zipped$ = zip(radioButton$, academicYear$, academicStatus$);
      return zipped$.pipe(
        map(([selector, zoneName, zoneStatus]) => {
          const item: ZoneSetupTableItem = {
            selector: selector,
            zoneName: zoneName,
            zoneStatus: zoneStatus,
          };
          return item;
        })
      );
    };
    const selectionHandler = () => {
      const onItemSelected = (item: ZoneSetupTableItem) => {
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
        )
        .subscribe();
    };
    const createTableList$ = (items: KeyValuePair[]) => {
      const observables = items.filter((m) => !!m).map(createTableItem);
      return combineLatest(observables);
    };
    const createDataSource = (list: ZoneSetupTableItem[]) => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      selectionHandler();
    };
    try {
      if (!this.tableJson)
        throw Error('Academic setup: Table json is invalid.');
      const academicTable$ = createTableList$(JSON.parse(this.tableJson));
      academicTable$
        .pipe(this.unsubscribe.takeUntilDestroy)
        .subscribe(createDataSource);
    } catch (error: any) {
      console.error(error);
      createTableList$([]);
    }
  }
  ngAfterViewInit(): void {
    this.init();
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
  checkboxLabel(row?: ZoneSetupTableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${this.dataSource?.data.find((item) => item === row)}`;
  }
  onSelect(row: ZoneSetupTableItem) {
    if (!this.selection.isSelected(row)) {
      this.selection.clear(); // Ensure only one row is selected
      this.selection.select(row); // Select the new row
    }
  }
  onCheckboxChange(row: ZoneSetupTableItem) {
    if (!this.selection.isSelected(row)) {
      this.selection.toggle(row); // Only select if it's not already selected
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (
      data: ZoneSetupTableItem,
      value: string
    ) =>
      data.zoneName && data?.zoneName?.toLocaleLowerCase().includes(value)
        ? true
        : false ||
          (data.zoneStatus &&
            data?.zoneStatus?.toLocaleLowerCase().includes(value))
        ? true
        : false;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
