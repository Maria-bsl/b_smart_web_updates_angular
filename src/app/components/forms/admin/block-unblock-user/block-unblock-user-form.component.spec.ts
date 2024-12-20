import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUnblockUserFormComponent } from './block-unblock-user-form.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('BlockUnblockUserFormComponent', () => {
  let component: BlockUnblockUserFormComponent;
  let fixture: ComponentFixture<BlockUnblockUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockUnblockUserFormComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockUnblockUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
