import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneSetupTableComponent } from './zone-setup-table.component';

describe('ZoneSetupTableComponent', () => {
  let component: ZoneSetupTableComponent;
  let fixture: ComponentFixture<ZoneSetupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneSetupTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneSetupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
