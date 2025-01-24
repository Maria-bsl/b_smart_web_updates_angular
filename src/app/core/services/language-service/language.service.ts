import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from '../app-config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(
    private _tr: TranslateService,
    private _appConfig: AppConfigService
  ) {}
  /**Initializes all languages to be used in component
   * @param availableLangs Available languages in the system
   * @param code active language
   */
  initLanguages(availableLangs: string[], code: string) {
    this._tr.addLangs(availableLangs);
    this._tr.setDefaultLang(code);
    this._tr.use(code);
  }
  /**
   * Changes the current language
   * @param code current language
   */
  changeLanguage(code: string) {
    this._appConfig.setCurrentLanguage(code);
  }
}
