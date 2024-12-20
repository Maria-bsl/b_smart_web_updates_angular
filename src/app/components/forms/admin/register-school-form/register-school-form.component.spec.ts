import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSchoolFormComponent } from './register-school-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('RegisterSchoolFormComponent', () => {
  let component: RegisterSchoolFormComponent;
  let fixture: ComponentFixture<RegisterSchoolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSchoolFormComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterSchoolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
