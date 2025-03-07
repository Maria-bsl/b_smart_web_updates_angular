import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
<<<<<<< HEAD
    selector: 'app-confirm-message-box',
    imports: [
        MatButtonModule,
        DialogModule,
        MatIconModule,
        MatDialogModule,
        MatDividerModule,
    ],
    templateUrl: './confirm-message-box.component.html',
    styleUrl: './confirm-message-box.component.scss'
=======
  selector: 'app-confirm-message-box',
  standalone: true,
  imports: [
    MatButtonModule,
    DialogModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './confirm-message-box.component.html',
  styleUrl: './confirm-message-box.component.scss',
>>>>>>> eb465d57eeec39fca151ad86e20fd4337434531a
})
export class ConfirmMessageBoxComponent {
  confirmClicked = new EventEmitter<void>();
  @ViewChild('dialogElement') dialogElement!: ElementRef<HTMLDialogElement>;
  data = inject(DIALOG_DATA);
  constructor(private _dialogRef: MatDialogRef<ConfirmMessageBoxComponent>) {}
  // openDialog() {
  //   this.dialogElement.nativeElement.showModal();
  // }
  closeDialog(event: MouseEvent) {
    event.preventDefault();
    this._dialogRef.close();
  }
  onConfirmClicked(event: MouseEvent) {
    this.confirmClicked.emit();
  }
}
