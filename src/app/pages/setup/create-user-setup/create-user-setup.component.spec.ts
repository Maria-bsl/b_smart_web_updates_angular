import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserSetupComponent } from './create-user-setup.component';

describe('CreateUserSetupComponent', () => {
  let component: CreateUserSetupComponent;
  let fixture: ComponentFixture<CreateUserSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUserSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUserSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
