import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMessageBoxComponent } from './confirm-message-box.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';

describe('ConfirmMessageBoxComponent', () => {
  let component: ConfirmMessageBoxComponent;
  let fixture: ComponentFixture<ConfirmMessageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmMessageBoxComponent, MatDialogModule],
      providers: [
        {
          provide: DIALOG_DATA,
          useValue: { title: 'Hehehe title', message: 'Message' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
