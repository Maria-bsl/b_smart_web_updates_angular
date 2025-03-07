import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTextSetupComponent } from './sms-text-setup.component';

describe('SmsTextSetupComponent', () => {
  let component: SmsTextSetupComponent;
  let fixture: ComponentFixture<SmsTextSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsTextSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsTextSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
