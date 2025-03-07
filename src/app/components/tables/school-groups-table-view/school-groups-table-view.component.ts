import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { TableFormat, TableHeader } from 'src/app/core/interfaces/table-format';
import { TableDataService } from 'src/app/core/services/table-data/table-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AddSchoolGroupFormComponent } from '../../forms/admin/add-school-group-form/add-school-group-form.component';
import { TooltipPosition, MatTooltipModule } from '@angular/material/tooltip';
import { EditSchoolGroupFormComponent } from '../../forms/admin/edit-school-group-form/edit-school-group-form.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';

@Component({
    selector: 'app-school-groups-table-view',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatRippleModule,
    ],
    templateUrl: './school-groups-table-view.component.html',
    styleUrl: './school-groups-table-view.component.scss'
})
export class SchoolGroupsTableViewComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['select', '1', '3'];
  selection = new SelectionModel<any>(false, []);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @Input() rawData: any[] = [];
  @Input() schoolGroupInputClientId: string = '';
  @Input() schoolGroupStatus: string = '';
  @Input() schoolsListView: string = '';
  @Input() createButton: string = '';
  @Input() updateButton: string = '';
  @Input() cancelButton: string = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public formGroup!: FormGroup;
  constructor(private fb: FormBuilder, private dialog: MatDialog) {}
  private createFormGroup() {
    this.formGroup = this.fb.group({
      tableSearch: this.fb.control('', []),
    });
  }
  private tableSearchEventHandler() {
    this.tableSearch.valueChanges.subscribe({
      next: (searchText) => {
        this.dataSource.filter = searchText.trim().toLocaleLowerCase();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
    });
  }
  private selectionChanged() {
    this.selection.changed.subscribe((change) => {
      this.onSelectionChange(change);
    });
  }
  isActiveStatus(status: string) {
    return status.toLocaleLowerCase() === 'active';
  }
  isInActiveStatus(status: string) {
    return status.toLocaleLowerCase() === 'inactive';
  }
  ngOnInit(): void {
    this.createFormGroup();
    this.tableSearchEventHandler();
    this.selectionChanged();
  }
  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource<any>(this.rawData);
    let filterPredicate = (data: any, filter: string) => {
      return data['1'].toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        ? true
        : false ||
          data['3'].toLocaleLowerCase().includes(filter.toLocaleLowerCase())
        ? true
        : false;
    };
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = filterPredicate;
    }
  }
  onSelectionChange(change: any) {
    let selected = this.getSelectedRow();
    //if (!selected) return;
    if (!selected) {
      let cancelBtn = document.getElementById(
        this.cancelButton
      ) as HTMLInputElement;
      cancelBtn.click();
    } else {
      let rowCheckBox = document.getElementById(
        selected['0']
      ) as HTMLInputElement;
      rowCheckBox.click();
    }
  }
  openAddSchoolGroupForm() {
    let dialogRef = this.dialog.open(AddSchoolGroupFormComponent, {
      width: '700px',
      disableClose: true,
      data: {
        schoolGroupInput: document.getElementById(
          this.schoolGroupInputClientId
        ) as HTMLInputElement,
        radioButtonElement: document.getElementById(
          this.schoolGroupStatus
        ) as HTMLSpanElement,
        title: 'Add New School Group',
        addSchoolButton: document.getElementById(
          this.createButton
        ) as HTMLInputElement,
        schoolListView: document.getElementById(this.schoolsListView),
      },
    });
  }
  openEditSchoolGroupForm() {
    let dialogRef = this.dialog.open(EditSchoolGroupFormComponent, {
      width: '700px',
      disableClose: true,
      data: {
        schoolGroupInput: document.getElementById(
          this.schoolGroupInputClientId
        ) as HTMLInputElement,
        radioButtonElement: document.getElementById(
          this.schoolGroupStatus
        ) as HTMLSpanElement,
        title: 'Edit School Group',
        editSchoolButton: document.getElementById(
          this.updateButton
        ) as HTMLInputElement,
        schoolListView: document.getElementById(this.schoolsListView),
      },
    });
  }
  openViewGroupRegisteredSchools() {
    // let dialogRef = this.dialog.open(
    //   ViewRegisteredSchoolsOfSchoolGroupsComponent,
    //   {
    //     width: '700px',
    //     height: '450px',
    //     data: {
    //       schoolsListView: document.getElementById(
    //         this.schoolsListView
    //       ) as HTMLSelectElement,
    //     },
    //   }
    // );
  }
  hasAtLeastOneSelection() {
    return this.selection.selected.length > 0;
  }
  getSelectedRow(): any {
    return this.selection.selected.length > 0
      ? this.selection.selected[0]
      : null;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  getCurrentSchoolGroupStatus(element: any) {
    let doc = document.getElementById(element['0']) as HTMLInputElement;
    if (doc.checked) {
      this.selection.select(element);
    }
    return doc.checked;
  }
  onCancelClicked() {
    let button = document.getElementById(this.cancelButton) as HTMLInputElement;
    button.click();
  }
  get tableSearch() {
    return this.formGroup.get('tableSearch') as FormControl;
  }
}
