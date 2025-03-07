import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumSetupComponent } from './medium-setup.component';

describe('MediumSetupComponent', () => {
  let component: MediumSetupComponent;
  let fixture: ComponentFixture<MediumSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediumSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
