import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicSetupComponent } from './academic-setup.component';

describe('AcademicSetupComponent', () => {
  let component: AcademicSetupComponent;
  let fixture: ComponentFixture<AcademicSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcademicSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
