import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrankBranchesSetupComponent } from './brank-branches-setup.component';

describe('BrankBranchesSetupComponent', () => {
  let component: BrankBranchesSetupComponent;
  let fixture: ComponentFixture<BrankBranchesSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrankBranchesSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrankBranchesSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
