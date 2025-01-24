import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginCaptchaComponent } from './login-captcha.component';

describe('LoginCaptchaComponent', () => {
  let component: LoginCaptchaComponent;
  let fixture: ComponentFixture<LoginCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginCaptchaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
