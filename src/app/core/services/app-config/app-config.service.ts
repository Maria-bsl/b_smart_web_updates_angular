import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageBoxDialogComponent } from 'src/app/components/dialogs/message-box-dialog/message-box-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private _dialog: MatDialog
  ) {}
  addIcons(icons: string[], path: string) {
    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`${path}/${icon}.svg`)
      );
    });
  }
  openMessageBox(title: string, message: string) {
    const dialogRef = this._dialog.open(MessageBoxDialogComponent, {
      data: {
        title: title,
        message: message,
      },
    });
  }
}
