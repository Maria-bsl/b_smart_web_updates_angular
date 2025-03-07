import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessModulesSetupComponent } from './access-modules-setup.component';

describe('AccessModulesSetupComponent', () => {
  let component: AccessModulesSetupComponent;
  let fixture: ComponentFixture<AccessModulesSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessModulesSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessModulesSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
