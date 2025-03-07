import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpSettingsSetupComponent } from './smtp-settings-setup.component';

describe('SmtpSettingsSetupComponent', () => {
  let component: SmtpSettingsSetupComponent;
  let fixture: ComponentFixture<SmtpSettingsSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmtpSettingsSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmtpSettingsSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
