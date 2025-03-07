import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneSetupComponent } from './zone-setup.component';

describe('ZoneSetupComponent', () => {
  let component: ZoneSetupComponent;
  let fixture: ComponentFixture<ZoneSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZoneSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
