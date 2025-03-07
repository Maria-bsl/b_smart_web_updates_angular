import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickRecaptchaComponent } from './quick-recaptcha.component';

describe('QuickRecaptchaComponent', () => {
  let component: QuickRecaptchaComponent;
  let fixture: ComponentFixture<QuickRecaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickRecaptchaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickRecaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
