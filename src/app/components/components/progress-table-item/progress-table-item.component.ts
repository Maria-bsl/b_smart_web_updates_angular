import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-progress-table-item',
    imports: [CommonModule],
    templateUrl: './progress-table-item.component.html',
    styleUrl: './progress-table-item.component.scss'
})
export class ProgressTableItemComponent {
  @Input() label: string = '';
  get isApproved() {
    return this.label.toLocaleLowerCase() === 'Approved'.toLocaleLowerCase();
  }
}
