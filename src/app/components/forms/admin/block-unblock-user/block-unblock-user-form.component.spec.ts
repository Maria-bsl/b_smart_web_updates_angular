import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUnblockUserFormComponent } from './block-unblock-user-form.component';

describe('BlockUnblockUserFormComponent', () => {
  let component: BlockUnblockUserFormComponent;
  let fixture: ComponentFixture<BlockUnblockUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockUnblockUserFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockUnblockUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
