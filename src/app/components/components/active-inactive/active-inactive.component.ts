import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-active-inactive',
  imports: [],
  templateUrl: './active-inactive.component.html',
  styleUrl: './active-inactive.component.scss',
})
export class ActiveInactiveComponent {
  @Input() label: string = '';
}
