import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationTableItemComponent } from './designation-table-item.component';

describe('DesignationTableItemComponent', () => {
  let component: DesignationTableItemComponent;
  let fixture: ComponentFixture<DesignationTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationTableItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
