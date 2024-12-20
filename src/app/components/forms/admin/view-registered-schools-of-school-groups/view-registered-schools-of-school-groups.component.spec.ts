import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegisteredSchoolsOfSchoolGroupsComponent } from './view-registered-schools-of-school-groups.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

describe('ViewRegisteredSchoolsOfSchoolGroupsComponent', () => {
  let component: ViewRegisteredSchoolsOfSchoolGroupsComponent;
  let fixture: ComponentFixture<ViewRegisteredSchoolsOfSchoolGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegisteredSchoolsOfSchoolGroupsComponent, MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { title: 'title', message: 'message' },
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ViewRegisteredSchoolsOfSchoolGroupsComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
