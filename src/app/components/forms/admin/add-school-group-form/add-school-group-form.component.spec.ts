import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolGroupFormComponent } from './add-school-group-form.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

describe('AddSchoolGroupFormComponent', () => {
  let component: AddSchoolGroupFormComponent;
  let fixture: ComponentFixture<AddSchoolGroupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSchoolGroupFormComponent, MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { title: 'title', message: 'message' },
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSchoolGroupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
