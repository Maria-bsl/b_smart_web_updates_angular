import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRegisteredSchoolsOfSchoolGroupsComponent } from './view-registered-schools-of-school-groups.component';

describe('ViewRegisteredSchoolsOfSchoolGroupsComponent', () => {
  let component: ViewRegisteredSchoolsOfSchoolGroupsComponent;
  let fixture: ComponentFixture<ViewRegisteredSchoolsOfSchoolGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRegisteredSchoolsOfSchoolGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewRegisteredSchoolsOfSchoolGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
