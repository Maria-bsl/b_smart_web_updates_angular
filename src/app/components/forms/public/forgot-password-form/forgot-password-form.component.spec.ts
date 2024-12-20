import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

describe('ForgotPasswordFormComponent', () => {
  let component: ForgotPasswordFormComponent;
  let fixture: ComponentFixture<ForgotPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordFormComponent, TranslateModule.forRoot()],
      providers: [provideAnimationsAsync(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
