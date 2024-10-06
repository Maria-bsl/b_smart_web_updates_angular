import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { TableHeader } from '../../interfaces/essentials/table-format';

@Injectable({
  providedIn: 'root',
})
export class TableDataService<T> {
  private table!: MatTable<T>;
  private data: T[] = [];
  private originalTableColumns: TableHeader[] = [];
  private tableColumns: TableHeader[] = [];
  private tableColumns$: Observable<TableHeader[]> = of([]);
  private dataSource: MatTableDataSource<T> = new MatTableDataSource<T>([]);
  private dataSourceFilterPredicate!: (data: T, filter: string) => boolean;
  private dataSourceSortingDataAccessor!: (data: any, property: string) => any;

  constructor() {}

  public setTable(table: MatTable<T>) {
    this.table = table;
  }
  public setData(data: T[]) {
    this.data = data;
  }
  public setOriginalTableColumns(originalTableColumns: TableHeader[]) {
    this.originalTableColumns = originalTableColumns;
  }
  public setTableColumns(tableColumns: TableHeader[]) {
    this.tableColumns = tableColumns;
  }
  public setTableColumnsObservable(
    tableColumns: TableHeader[] = this.tableColumns
  ) {
    this.tableColumns$ = of(tableColumns);
  }
  public setDataSource(dataSource: MatTableDataSource<T>) {
    this.dataSource = dataSource;
  }
  public getTable() {
    return this.table;
  }
  public getData() {
    return this.data;
  }
  public getOriginalTableColumns() {
    return this.originalTableColumns;
  }
  public getTableColumns() {
    return this.tableColumns;
  }
  public getTableColumnsObservable() {
    return this.tableColumns$;
  }
  public getDataSource() {
    return this.dataSource;
  }
  public searchTable(searchText: string) {
    this.dataSource.filter = searchText.trim().toLocaleLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  public prepareDataSource(paginator: MatPaginator, sort: MatSort) {
    this.dataSource = new MatTableDataSource<T>(this.data);
    this.dataSource.paginator = paginator;
    this.dataSource.sort = sort;
    if (this.dataSourceFilterPredicate) {
      this.dataSource.filterPredicate = this.dataSourceFilterPredicate;
    }
    if (this.dataSourceSortingDataAccessor) {
      this.dataSource.sortingDataAccessor = this.dataSourceSortingDataAccessor;
    }
  }
  public initDataSource(sort: MatSort) {
    this.dataSource = new MatTableDataSource<T>(this.data);
    this.dataSource.sort = sort;
    if (this.dataSourceFilterPredicate) {
      this.dataSource.filterPredicate = this.dataSourceFilterPredicate;
    }
    if (this.dataSourceSortingDataAccessor) {
      this.dataSource.sortingDataAccessor = this.dataSourceSortingDataAccessor;
    }
  }
  public setDataSourceFilterPredicate(
    filterPredicate: (data: T, filter: string) => boolean
  ) {
    this.dataSourceFilterPredicate = filterPredicate;
    if (this.dataSource) {
      this.dataSource.filterPredicate = this.dataSourceFilterPredicate;
    }
  }
  public setDataSourceSortingDataAccessor(
    sortingDataAccessor: (item: any, property: string) => any
  ) {
    this.dataSourceSortingDataAccessor = sortingDataAccessor;
    if (this.dataSource) {
      this.dataSource.sortingDataAccessor = this.dataSourceSortingDataAccessor;
    }
  }
  public addedData(item: T) {
    this.data.unshift(item);
    this.dataSource._updateChangeSubscription();
  }
  public editedData(item: T, index: number) {
    if (index !== -1) {
      this.data.splice(index, 1, item);
      this.dataSource._updateChangeSubscription();
    }
  }
  public removedData(index: number) {
    if (index !== -1) {
      this.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }
  public resetTableColumns(headers: FormArray) {
    let tableColumns = headers.controls
      .filter((header) => header.get('included')?.value)
      .map((header) => {
        return {
          label: header.get('label')?.value,
          value: header.get('value')?.value,
          desc: header.get('desc')?.value,
        } as TableHeader;
      });
    this.setTableColumns(tableColumns);
    this.setTableColumnsObservable(tableColumns);
  }
}
