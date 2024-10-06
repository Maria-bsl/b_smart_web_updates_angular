import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangePasswordFormComponent } from 'src/app/components/forms/admin/change-password-form/change-password-form.component';

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [ChangePasswordFormComponent, ChangePasswordFormComponent],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPageComponent {
  @Input('password-expired-label')
  passwordExpiredMessageClientId!: string;
  @Input('password-modify-label')
  passwordUpdateMessageClientId!: string;
  @Input('current-password-client-id') currentPasswordClientId: string = '';
  @Input('new-password-client-id') newPasswordClientId: string = '';
  @Input('confirm-password-client-id') confirmPasswordClientId: string = '';
  @Input('change-password-button-client-id')
  changePasswordButtonClientId: string = '';
}
