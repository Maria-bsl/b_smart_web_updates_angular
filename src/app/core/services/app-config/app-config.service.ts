import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap, zip } from 'rxjs';
import { ConfirmMessageBoxComponent } from 'src/app/components/dialogs/confirm-message-box/confirm-message-box.component';
import { MessageBoxDialogComponent } from 'src/app/components/dialogs/message-box-dialog/message-box-dialog.component';
import { UnsubscribeService } from '../unsubscribe-service/unsubscribe.service';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private _dialog: MatDialog,
    private tr: TranslateService,
    private unsubscribe: UnsubscribeService
  ) {}
  /**
   * Registers icons to be available to <mat-icon>
   * @param icons - List of icon names with .svg file extension excluded
   * @param path - Folder path where to find icons specified
   */
  addIcons(icons: string[], path: string) {
    icons.forEach((icon) => {
      this.iconRegistry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(`${path}/${icon}.svg`)
      );
    });
  }
  /**
   * Opens a message box dialog
   * @param title NGX-Translate string for message box title
   * @param message NGX-Translate string for message box content message
   * @returns An observable of the expected dialog box.
   */
  openMessageBox(
    title: string,
    message: string
  ): Observable<MatDialogRef<MessageBoxDialogComponent, any>> {
    const dialogRef = (msg1: string, msg2: string) => {
      return this._dialog.open(MessageBoxDialogComponent, {
        data: {
          title: msg1,
          message: msg2,
        },
      });
    };
    const merged = zip(this.tr.get(title), this.tr.get(message));
    return merged.pipe(
      switchMap((results) => of(dialogRef(results[0], results[1])))
    );
  }
  openConfirmationDialog(title: string, message: string) {
    const dialogRef = (msg1: string, msg2: string) => {
      return this._dialog.open(ConfirmMessageBoxComponent, {
        data: {
          title: msg1,
          message: msg2,
        },
      });
    };
    const merged = zip(this.tr.get(title), this.tr.get(message));
    return merged.pipe(
      this.unsubscribe.takeUntilDestroy,
      switchMap((results) => of(dialogRef(results[0], results[1])))
    );
  }
  /**
   * Initializes languages to be used
   */
  initLanguage() {
    this.tr.addLangs(['en', 'sw']);
    this.tr.setDefaultLang('en');
    //this.tr.use('en');
    let code = localStorage.getItem('currentLang');
    if (code) {
      this.tr.use(code);
    } else {
      this.tr.use('en');
    }
  }
  /**
   * Current language being used.
   * @returns The current language in use.
   */
  getCurrentLanguage() {
    return this.tr.currentLang;
  }
  /**
   * Current language being used.
   * @param code - language code E.G en,sw,lg
   */
  setCurrentLanguage(code: string) {
    localStorage.setItem('currentLang', code);
    this.tr.use(code);
  }
}
