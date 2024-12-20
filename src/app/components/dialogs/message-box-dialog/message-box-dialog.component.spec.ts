import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageBoxDialogComponent } from './message-box-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';

describe('MessageBoxDialogComponent', () => {
  let component: MessageBoxDialogComponent;
  let fixture: ComponentFixture<MessageBoxDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MessageBoxDialogComponent,
        TranslateModule.forRoot(),
        MatDialogModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { title: 'title', message: 'message' },
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageBoxDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
