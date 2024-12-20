import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPageComponent } from './change-password-page.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('ChangePasswordPageComponent', () => {
  let component: ChangePasswordPageComponent;
  let fixture: ComponentFixture<ChangePasswordPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordPageComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
