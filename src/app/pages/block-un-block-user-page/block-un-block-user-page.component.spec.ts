import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUnBlockUserPageComponent } from './block-un-block-user-page.component';

describe('BlockUnBlockUserPageComponent', () => {
  let component: BlockUnBlockUserPageComponent;
  let fixture: ComponentFixture<BlockUnBlockUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockUnBlockUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockUnBlockUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
