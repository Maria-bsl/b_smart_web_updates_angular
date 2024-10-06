import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolGroupsPageComponent } from './school-groups-page.component';

describe('SchoolGroupsPageComponent', () => {
  let component: SchoolGroupsPageComponent;
  let fixture: ComponentFixture<SchoolGroupsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolGroupsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchoolGroupsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
