import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionPageComponent } from './admission-page.component';

describe('AdmissionPageComponent', () => {
  let component: AdmissionPageComponent;
  let fixture: ComponentFixture<AdmissionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdmissionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
