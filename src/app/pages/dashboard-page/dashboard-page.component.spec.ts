import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
} from '@ngx-translate/core';

import { DashboardPageComponent } from './dashboard-page.component';
import { importProvidersFrom } from '@angular/core';
import { createTranslateLoader } from 'src/main';
import { HttpClient } from '@angular/common/http';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, TranslateModule.forRoot()],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
