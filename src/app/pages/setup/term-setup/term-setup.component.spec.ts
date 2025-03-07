import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermSetupComponent } from './term-setup.component';

describe('TermSetupComponent', () => {
  let component: TermSetupComponent;
  let fixture: ComponentFixture<TermSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
