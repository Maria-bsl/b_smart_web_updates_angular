import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchoolGroupFormComponent } from './edit-school-group-form.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

describe('EditSchoolGroupFormComponent', () => {
  let component: EditSchoolGroupFormComponent;
  let fixture: ComponentFixture<EditSchoolGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSchoolGroupFormComponent, MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditSchoolGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
