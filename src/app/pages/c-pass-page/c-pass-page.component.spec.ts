import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CPassPageComponent } from './c-pass-page.component';

describe('CPassPageComponent', () => {
  let component: CPassPageComponent;
  let fixture: ComponentFixture<CPassPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CPassPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CPassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
