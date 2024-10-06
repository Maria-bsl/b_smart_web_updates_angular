import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchoolGroupFormComponent } from './edit-school-group-form.component';

describe('EditSchoolGroupFormComponent', () => {
  let component: EditSchoolGroupFormComponent;
  let fixture: ComponentFixture<EditSchoolGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSchoolGroupFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSchoolGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
