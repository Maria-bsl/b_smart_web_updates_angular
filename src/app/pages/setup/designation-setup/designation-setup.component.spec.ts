import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationSetupComponent } from './designation-setup.component';

describe('DesignationSetupComponent', () => {
  let component: DesignationSetupComponent;
  let fixture: ComponentFixture<DesignationSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
