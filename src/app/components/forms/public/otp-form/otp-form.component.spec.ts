import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpFormComponent } from './otp-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('OtpFormComponent', () => {
  let component: OtpFormComponent;
  let fixture: ComponentFixture<OtpFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpFormComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(OtpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
