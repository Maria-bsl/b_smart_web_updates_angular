import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTextSetupComponent } from './email-text-setup.component';

describe('EmailTextSetupComponent', () => {
  let component: EmailTextSetupComponent;
  let fixture: ComponentFixture<EmailTextSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailTextSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTextSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
