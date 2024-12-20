import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionFormComponent } from './admission-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

describe('AdmissionFormComponent', () => {
  let component: AdmissionFormComponent;
  let fixture: ComponentFixture<AdmissionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionFormComponent, TranslateModule.forRoot()],
      providers: [provideAnimationsAsync(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
