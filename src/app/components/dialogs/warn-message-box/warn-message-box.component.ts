import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-warn-message-box',
    imports: [],
    templateUrl: './warn-message-box.component.html',
    styleUrl: './warn-message-box.component.scss'
})
export class WarnMessageBoxComponent {
  @ViewChild('dialogElement') dialogElement!: ElementRef<HTMLDialogElement>;
  constructor() {}
  openDialog() {
    this.dialogElement.nativeElement.showModal();
  }
}
