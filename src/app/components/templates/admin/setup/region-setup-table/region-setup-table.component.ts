import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  concatMap,
  endWith,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { ActiveInactiveComponent } from 'src/app/components/components/active-inactive/active-inactive.component';
import { ERegionSetupItem } from 'src/app/core/enums/admin/setup/region-setup.enum';
import { RegionSetupTableItem } from 'src/app/core/interfaces/admin/setup/academic.setup';
import { KeyValuePair } from 'src/app/core/interfaces/table-format';
import { IsSelectedItemPipe } from 'src/app/core/pipes/is-selected-row-pipe/is-selected-row.pipe';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { TableItem } from 'src/app/shared/logic/table-item';

@Component({
    selector: 'app-region-setup-table',
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
        ReactiveFormsModule,
    ],
    templateUrl: './region-setup-table.component.html',
    styleUrl: './region-setup-table.component.scss'
})
export class RegionSetupTableComponent implements AfterViewInit {
  headers$: Observable<string[]> = of([
    'selector',
    'regionName',
    'countryName',
    'regionStatus',
  ]);
  @Input() tableJson: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  deselectedAllRows: EventEmitter<void> = new EventEmitter();
  deleteRow: EventEmitter<void> = new EventEmitter();
  constructor(
    private unsubscribe: UnsubscribeService,
    private _dom: ElementDomManipulationService,
    private _table: TableDataService<RegionSetupTableItem>
  ) {}
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
  ngAfterViewInit(): void {
    this._table
      .init(this.tableJson, this.paginator, this.sort, this.createTableItem$)
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        error: (e) => console.error(e),
      });
    this._table.applyFilter(['regionName', 'countryName']);
  }
  get tableService() {
    return this._table;
  }
}
