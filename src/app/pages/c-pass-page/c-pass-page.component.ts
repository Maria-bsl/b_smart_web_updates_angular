import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CPassFormComponent } from 'src/app/components/forms/admin/cpass-form/cpass-form.component';

@Component({
  selector: 'app-c-pass-page',
  standalone: true,
  imports: [CPassFormComponent],
  templateUrl: './c-pass-page.component.html',
  styleUrl: './c-pass-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CPassPageComponent {
  @Input('secret-question-dropdown-client-id') secretQuestionClientId: string =
    '';
  @Input('answer-client-id') answerTextFieldClientId: string = '';
  @Input('new-password-client-id')
  newPasswordTextFieldClientId: string = '';
  @Input('confirm-password-client-id')
  confirmPasswordTextFieldClientId: string = '';
  @Input('capcha-client-id') capchaTextFieldClientId: string = '';
  @Input('image-capcha-client-id') imageCapchaClientId: string = '';
  @Input('capcha-button-client-id')
  refreshCapchaButtonClientId: string = '';
  @Input('cpass-submit-button') cpassSubmitButton: string = '';
}
