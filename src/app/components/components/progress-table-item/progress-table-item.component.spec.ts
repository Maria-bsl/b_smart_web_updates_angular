import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressTableItemComponent } from './progress-table-item.component';

describe('ProgressTableItemComponent', () => {
  let component: ProgressTableItemComponent;
  let fixture: ComponentFixture<ProgressTableItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressTableItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
