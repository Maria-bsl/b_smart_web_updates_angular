import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSchoolInfoFormComponent } from './update-school-info-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

describe('UpdateSchoolInfoFormComponent', () => {
  let component: UpdateSchoolInfoFormComponent;
  let fixture: ComponentFixture<UpdateSchoolInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSchoolInfoFormComponent, TranslateModule.forRoot()],
      providers: [provideAnimationsAsync(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateSchoolInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
