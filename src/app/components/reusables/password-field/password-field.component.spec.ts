import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordFieldComponent } from './password-field.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PasswordFieldComponent', () => {
  let component: PasswordFieldComponent;
  let fixture: ComponentFixture<PasswordFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordFieldComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
