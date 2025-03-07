import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SchoolGroupsTableViewComponent } from 'src/app/components/tables/school-groups-table-view/school-groups-table-view.component';

@Component({
    selector: 'app-school-groups-page',
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        SchoolGroupsTableViewComponent,
    ],
    templateUrl: './school-groups-page.component.html',
    styleUrl: './school-groups-page.component.scss'
})
export class SchoolGroupsPageComponent {
  @Input('table-data-content') tableDataContent: string = '';
  @Input('school-group-input-client-id') schoolGroupInput: string = '';
  @Input('schools-list-view-client-id') schoolsListView: string = '';
  @Input('status-radio-group-client-id') statusRadioGroup: string = '';
  @Input('create-button-client-id') createButton: string = '';
  @Input('update-button-client-id') updateButton: string = '';
  @Input('cancel-button-client-id') cancelButton: string = '';
}
