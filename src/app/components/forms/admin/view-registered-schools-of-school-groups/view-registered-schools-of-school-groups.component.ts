import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppUtilities } from 'src/app/utilities/app-utilities';

@Component({
  selector: 'app-view-registered-schools-of-school-groups',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './view-registered-schools-of-school-groups.component.html',
  styleUrl: './view-registered-schools-of-school-groups.component.scss',
})
export class ViewRegisteredSchoolsOfSchoolGroupsComponent {}
// export class ViewRegisteredSchoolsOfSchoolGroupsComponent implements OnInit {
//   $schoolsListView = new BehaviorSubject<HtmlSelectOption[]>([]);
//   constructor(
//     private dialogRef: MatDialogRef<ViewRegisteredSchoolsOfSchoolGroupsComponent>,
//     @Inject(MAT_DIALOG_DATA)
//     public data: {
//       schoolsListView: HTMLSelectElement;
//     }
//   ) {}
//   private createSchoolsListView() {
//     let schools = AppUtilities.getSelectOptionsAsArray(
//       this.data.schoolsListView
//     );
//     this.$schoolsListView.next(schools);
//   }
//   ngOnInit(): void {
//     if (!this.data.schoolsListView)
//       throw Error('Failed to find schools listview id.');
//     this.createSchoolsListView();
//     this.$schoolsListView.subscribe({
//       next: (value) => console.log(value),
//     });
//   }
// }
