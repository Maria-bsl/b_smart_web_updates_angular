import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPassFormComponent } from './cpass-form.component';

describe('CPassFormComponent', () => {
  let component: CPassFormComponent;
  let fixture: ComponentFixture<CPassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPassFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CPassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
