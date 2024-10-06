import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnMessageBoxComponent } from './warn-message-box.component';

describe('WarnMessageBoxComponent', () => {
  let component: WarnMessageBoxComponent;
  let fixture: ComponentFixture<WarnMessageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarnMessageBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarnMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
