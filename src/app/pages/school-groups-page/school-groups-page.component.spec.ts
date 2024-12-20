import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolGroupsPageComponent } from './school-groups-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('SchoolGroupsPageComponent', () => {
  let component: SchoolGroupsPageComponent;
  let fixture: ComponentFixture<SchoolGroupsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolGroupsPageComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(SchoolGroupsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
