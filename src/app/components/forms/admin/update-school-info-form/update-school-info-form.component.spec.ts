import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSchoolInfoFormComponent } from './update-school-info-form.component';

describe('UpdateSchoolInfoFormComponent', () => {
  let component: UpdateSchoolInfoFormComponent;
  let fixture: ComponentFixture<UpdateSchoolInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSchoolInfoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSchoolInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
