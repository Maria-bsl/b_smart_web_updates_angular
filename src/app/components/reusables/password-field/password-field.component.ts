import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-password-field',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatIconModule,
    ],
    templateUrl: './password-field.component.html',
    styleUrl: './password-field.component.scss'
})
export class PasswordFieldComponent {
  @Input() passwordControl: FormControl = new FormControl();
  @Input() placeholder: string = '';
  textType: 'password' | 'text' = 'password';
  onVisibilityIconClicked() {
    this.textType = this.textType === 'password' ? 'text' : 'password';
  }
}
