import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSetupComponent } from './region-setup.component';

describe('RegionSetupComponent', () => {
  let component: RegionSetupComponent;
  let fixture: ComponentFixture<RegionSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
