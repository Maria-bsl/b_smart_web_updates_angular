import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolGroupsTableViewComponent } from './school-groups-table-view.component';

describe('SchoolGroupsTableViewComponent', () => {
  let component: SchoolGroupsTableViewComponent;
  let fixture: ComponentFixture<SchoolGroupsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolGroupsTableViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolGroupsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
