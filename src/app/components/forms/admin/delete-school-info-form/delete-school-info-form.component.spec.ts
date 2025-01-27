import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSchoolInfoFormComponent } from './delete-school-info-form.component';

describe('DeleteSchoolInfoFormComponent', () => {
  let component: DeleteSchoolInfoFormComponent;
  let fixture: ComponentFixture<DeleteSchoolInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSchoolInfoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSchoolInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
