import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictSetupComponent } from './district-setup.component';

describe('DistrictSetupComponent', () => {
  let component: DistrictSetupComponent;
  let fixture: ComponentFixture<DistrictSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
