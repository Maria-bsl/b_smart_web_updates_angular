import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeWatcherService implements OnDestroy {
  private mediaQuery!: MediaQueryList;
  private themeChangeSubject = new Subject<string>();
  themeChange$ = this.themeChangeSubject.asObservable();
  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaQuery.addEventListener(
      'change',
      this.detectColorScheme.bind(this)
    );
    this.detectColorScheme();
  }
  private detectColorScheme() {
    const theme = this.mediaQuery.matches ? 'theme-dark' : 'theme-light';
    this.themeChangeSubject.next(theme);
  }
  ngOnDestroy(): void {
    this.mediaQuery.removeEventListener(
      'change',
      this.detectColorScheme.bind(this)
    );
  }
}
