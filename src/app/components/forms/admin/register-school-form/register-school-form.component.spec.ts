import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSchoolFormComponent } from './register-school-form.component';

describe('RegisterSchoolFormComponent', () => {
  let component: RegisterSchoolFormComponent;
  let fixture: ComponentFixture<RegisterSchoolFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterSchoolFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterSchoolFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
