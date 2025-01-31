import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AcademicSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { combineLatest, map, Observable, of, switchMap, tap, zip } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { IsSelectedRowPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { EAcademicSetupItem } from 'src/app/core/enums/admin/setup/academic-setup.enum';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { TableItem } from 'src/app/shared/logic/table-item';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-academic-table',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    IsSelectedRowPipe,
    TranslateModule,
    ActiveInactiveComponent,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
  ],
  templateUrl: './academic-table.component.html',
  styleUrl: './academic-table.component.scss',
})
export class AcademicTableComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'radioButton',
    'academicYear',
    'academicStatus',
  ]);
  dataSource!: MatTableDataSource<AcademicSetupTableItem>;
  @Input() tableJson: string = '';
  selection = new SelectionModel<AcademicSetupTableItem>(false, []);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  constructor(
    private unsubscribe: UnsubscribeService,
    private _dom: ElementDomManipulationService
  ) {}
  private init() {
    const initAcademicTable = () => {
      const createAcademicSetupTableItem = (item: KeyValuePair) => {
        const tableItem = new TableItem(Object.values(item));
        const radioButton$ = tableItem.getTableItem$<HTMLInputElement>(
          EAcademicSetupItem.RADIO_BUTTON,
          (value: string) => document.getElementById(value) as HTMLInputElement
        );
        const academicYear$ = tableItem.getTableItem$<string>(
          EAcademicSetupItem.ACADEMIC_YEAR,
          (value: string) => value
        );
        const academicStatus$ = tableItem.getTableItem$<string>(
          EAcademicSetupItem.ACADEMIC_STATUS,
          (value: string) => value
        );
        const zipped$ = zip(radioButton$, academicYear$, academicStatus$);
        return zipped$.pipe(
          map(([radioButton, academicYear, academicStatus]) => {
            return {
              radioButton: radioButton,
              academicYear: academicYear,
              academicStatus: academicStatus,
            } as AcademicSetupTableItem;
          })
        );
      };
      const createAcademicSetupTableItems$ = (items: KeyValuePair[]) => {
        const observables = items
          .filter((m) => !!m)
          .map(createAcademicSetupTableItem);
        return combineLatest(observables);
      };
      const selectionHandler = () => {
        const onItemSelected = (item: AcademicSetupTableItem) => {
          item.radioButton && this._dom.clickButton(item.radioButton);
        };
        return this.dataSource
          .connect()
          .asObservable()
          .pipe(
            this.unsubscribe.takeUntilDestroy,
            tap({
              next: (items) =>
                items.forEach((item) => {
                  item.radioButton &&
                    item.radioButton.checked &&
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
      const createDataSource = (list: AcademicSetupTableItem[]) => {
        this.dataSource = new MatTableDataSource(list);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        selectionHandler();
      };
      try {
        if (!this.tableJson)
          throw Error('Academic setup: Table json is invalid.');
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
    };
    initAcademicTable();
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
  checkboxLabel(row?: AcademicSetupTableItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${this.dataSource?.data.find((item) => item === row)}`;
  }
  onSelect(row: AcademicSetupTableItem) {
    if (!this.selection.isSelected(row)) {
      this.selection.clear(); // Ensure only one row is selected
      this.selection.select(row); // Select the new row
    }
  }
  onCheckboxChange(row: AcademicSetupTableItem) {
    if (!this.selection.isSelected(row)) {
      this.selection.toggle(row); // Only select if it's not already selected
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (
      data: AcademicSetupTableItem,
      value: string
    ) =>
      data.academicYear &&
      data?.academicYear?.toLocaleLowerCase().includes(value)
        ? true
        : false ||
          (data.academicYear &&
            data?.academicStatus?.toLocaleLowerCase().includes(value))
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
}
