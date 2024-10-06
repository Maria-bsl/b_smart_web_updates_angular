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

@Component({
  selector: 'app-confirm-message-box',
  standalone: true,
  imports: [MatButtonModule, DialogModule, MatIconModule],
  templateUrl: './confirm-message-box.component.html',
  styleUrl: './confirm-message-box.component.scss',
})
export class ConfirmMessageBoxComponent {
  closeClicked = new EventEmitter<void>();
  confirmClicked = new EventEmitter<void>();
  @ViewChild('dialogElement') dialogElement!: ElementRef<HTMLDialogElement>;
  data = inject(DIALOG_DATA);
  constructor() {}
  // openDialog() {
  //   this.dialogElement.nativeElement.showModal();
  // }
  closeDialog() {
    this.closeClicked.emit();
  }
  onConfirmClicked() {
    this.confirmClicked.emit();
  }
}
