import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordAgingSetupComponent } from './password-aging-setup.component';

describe('PasswordAgingSetupComponent', () => {
  let component: PasswordAgingSetupComponent;
  let fixture: ComponentFixture<PasswordAgingSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordAgingSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordAgingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
