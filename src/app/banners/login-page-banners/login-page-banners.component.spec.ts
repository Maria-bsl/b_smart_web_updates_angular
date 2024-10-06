import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageBannersComponent } from './login-page-banners.component';

describe('LoginPageBannersComponent', () => {
  let component: LoginPageBannersComponent;
  let fixture: ComponentFixture<LoginPageBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageBannersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginPageBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
