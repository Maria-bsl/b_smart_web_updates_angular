import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolGroupFormComponent } from './add-school-group-form.component';

describe('AddSchoolGroupFormComponent', () => {
  let component: AddSchoolGroupFormComponent;
  let fixture: ComponentFixture<AddSchoolGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSchoolGroupFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSchoolGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
