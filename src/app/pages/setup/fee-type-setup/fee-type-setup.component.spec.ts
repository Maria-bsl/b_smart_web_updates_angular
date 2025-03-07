import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTypeSetupComponent } from './fee-type-setup.component';

describe('FeeTypeSetupComponent', () => {
  let component: FeeTypeSetupComponent;
  let fixture: ComponentFixture<FeeTypeSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeTypeSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeTypeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
