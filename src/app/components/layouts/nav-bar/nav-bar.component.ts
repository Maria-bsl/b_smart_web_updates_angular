import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateService } from '@ngx-translate/core';
import { erase, error } from 'highcharts';
import { delay, map, Observable, of } from 'rxjs';
import { ENavBarForm } from 'src/app/core/enums/navbar.enum';
import { ILanguage } from 'src/app/core/interfaces/helpers/languages/ilanguages';
import { LanguagesPipe } from 'src/app/core/pipes/languages-pipe/languages.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { SidenavService } from 'src/app/core/services/sidenav/sidenav.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatSlideToggleModule,
    NgOptimizedImage,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    LanguagesPipe,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
  animations: [inOutAnimation],
})
export class NavBarComponent implements AfterViewInit {
  @Output('languageChanged') public languageChanged =
    new EventEmitter<string>();
  @Input('keys') keys: string = '';
  s_username = signal<string>('');
  s_designation = signal<string>('');
  s_loginTime = signal<string>('');
  formGroup: FormGroup = this.fb.group({
    language: this.fb.control('', []),
  });
  languages$: Observable<ILanguage[]> = of([
    { code: 'en', label: 'English', icon: 'gb' },
    { code: 'sw', label: 'Swahili', icon: 'tz' },
  ]);
  ids$!: Observable<MElementPair>;
  constructor(
    private _appConfig: AppConfigService,
    private fb: FormBuilder,
    private unsubscribe: UnsubscribeService,
    private domService: ElementDomManipulationService,
    private _sidenavService: SidenavService,
    private languageService: LanguageService
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.languageChangeHandler();
    this.language.setValue(localStorage.getItem('currentLang'));
    this.registerIcons();
    if (this.language.value !== this._appConfig.getCurrentLanguage()) {
      this.languageService.changeLanguage(this.language.value);
    }
  }
  private registerIcons() {
    let icons = ['gb', 'tz'];
    let feather = ['chevron-down', 'log-out', 'chevron-up', 'menu', 'x'];
    this._appConfig.addIcons(icons, '../assets/assets/images');
    this._appConfig.addIcons(feather, '../assets/assets/feather');
  }
  private languageChangeHandler() {
    const setLanguage = (value: string) => {
      if (this._appConfig.getCurrentLanguage() !== value) {
        this._appConfig.setCurrentLanguage(value);
        this.languageChanged.emit(value);
      }
    };
    this.language.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => value && setLanguage(value),
        error: (err) => console.error(err),
      });
  }
  private parseUsernameEventHandler() {
    const username$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(ENavBarForm.USER_NAME) as HTMLSpanElement)
    );
    username$.subscribe({
      next: (username) => {
        username &&
          this.s_username.set(username.textContent ?? username.innerHTML);
        !username && console.warn('Navbar: username not found.');
      },
      error: (err) => console.error(err),
    });
  }
  private parseDesignationEventHandler() {
    const designation$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(ENavBarForm.DESIGNATION) as HTMLSpanElement)
    );
    designation$.subscribe({
      next: (designation) => {
        designation &&
          this.s_designation.set(
            designation.textContent ?? designation.innerHTML
          );
        !designation && console.warn('Navbar: designation not found.');
      },
      error: (err) => console.error(err),
    });
  }
  private parseLoginTimeEventHandler() {
    const loginTime$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(ENavBarForm.LOGIN_TIME) as HTMLSpanElement)
    );
    loginTime$.pipe(delay(500)).subscribe({
      next: (loginTime) => {
        loginTime &&
          this.s_loginTime.set(loginTime.textContent ?? loginTime.innerHTML);
        !loginTime && console.warn('Navbar: login time text not found.');
      },
      error: (err) => console.error(err),
    });
  }
  private attachEventHandlers() {
    this.parseUsernameEventHandler();
    this.parseDesignationEventHandler();
    this.parseLoginTimeEventHandler();
  }
  changeLanguage(event: MouseEvent, value: string) {
    this.language.setValue(value);
  }
  private initIds() {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(ENavBarForm).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  ngAfterViewInit(): void {
    this.initIds();
  }
  logoutClicked(event: MouseEvent) {
    const logOut$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(ENavBarForm.LOG_OUT) as HTMLAnchorElement)
    );
    logOut$.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (logOut) => {
        logOut && this.domService.clickAnchorHref(logOut);
        !logOut && console.warn('Navbar: Failed to find log out button');
      },
      error: (err) => console.error(err),
    });
  }
  openSidebar(event: MouseEvent) {
    this._sidenavService.s_isOpened.set(!this._sidenavService.s_isOpened());
  }
  get language() {
    return this.formGroup.get('language') as FormControl;
  }
  get isOpenedSideBar() {
    return this._sidenavService.s_isOpened();
  }
}
