import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-designation-table-item',
    imports: [CommonModule],
    templateUrl: './designation-table-item.component.html',
    styleUrl: './designation-table-item.component.scss'
})
export class DesignationTableItemComponent {
  @Input() label: string = '';
  get isAdministrator() {
    return (
      this.label.toLocaleLowerCase() === 'ADMINISTRATOR'.toLocaleLowerCase()
    );
  }
  get isManager() {
    return this.label.toLocaleLowerCase() === 'MANAGER'.toLocaleLowerCase();
  }
  get isOfficer() {
    return !this.isAdministrator && !this.isManager;
  }
}
