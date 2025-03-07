import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardSetupComponent } from './ward-setup.component';

describe('WardSetupComponent', () => {
  let component: WardSetupComponent;
  let fixture: ComponentFixture<WardSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
