import { Component, Input } from '@angular/core';

@Component({
<<<<<<< HEAD
    selector: 'app-active-inactive',
    imports: [],
    templateUrl: './active-inactive.component.html',
    styleUrl: './active-inactive.component.scss'
=======
  selector: 'app-active-inactive',
  standalone: true,
  imports: [],
  templateUrl: './active-inactive.component.html',
  styleUrl: './active-inactive.component.scss',
>>>>>>> eb465d57eeec39fca151ad86e20fd4337434531a
})
export class ActiveInactiveComponent {
  @Input() label: string = '';
}
