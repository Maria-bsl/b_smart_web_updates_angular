import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolGroupsTableViewComponent } from './school-groups-table-view.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('SchoolGroupsTableViewComponent', () => {
  let component: SchoolGroupsTableViewComponent;
  let fixture: ComponentFixture<SchoolGroupsTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolGroupsTableViewComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolGroupsTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
