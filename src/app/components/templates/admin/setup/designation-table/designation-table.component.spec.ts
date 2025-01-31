import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationTableComponent } from './designation-table.component';

describe('DesignationTableComponent', () => {
  let component: DesignationTableComponent;
  let fixture: ComponentFixture<DesignationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
