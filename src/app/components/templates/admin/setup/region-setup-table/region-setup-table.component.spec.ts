import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSetupTableComponent } from './region-setup-table.component';

describe('RegionSetupTableComponent', () => {
  let component: RegionSetupTableComponent;
  let fixture: ComponentFixture<RegionSetupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSetupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegionSetupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
