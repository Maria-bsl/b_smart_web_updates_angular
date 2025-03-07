import { Component, Input } from '@angular/core';
import { BlockUnblockUserFormComponent } from 'src/app/components/forms/admin/block-unblock-user/block-unblock-user-form.component';

@Component({
    selector: 'app-block-un-block-user-page',
    imports: [BlockUnblockUserFormComponent],
    templateUrl: './block-un-block-user-page.component.html',
    styleUrl: './block-un-block-user-page.component.scss'
})
export class BlockUnBlockUserPageComponent {
  @Input('user-types-select') userTypesSelect: string = '';
  @Input('block-unblock-user-action') blockUnblockUserAction: string = '';
  @Input('institutions-select') institutionsSelect: string = '';
  @Input('full-name') fullName: string = '';
  @Input('reason-for-block') reasonForBlock: string = '';
}
