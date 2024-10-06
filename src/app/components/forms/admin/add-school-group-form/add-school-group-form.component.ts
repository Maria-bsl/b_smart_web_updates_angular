import { CommonModule } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { ConfirmMessageBoxComponent } from '../../../dialogs/confirm-message-box/confirm-message-box.component';
import { MatListModule } from '@angular/material/list';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { BehaviorSubject } from 'rxjs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';

@Component({
  selector: 'app-add-school-group-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    CommonModule,
    MatListModule,
  ],
  templateUrl: './add-school-group-form.component.html',
  styleUrl: './add-school-group-form.component.scss',
})
export class AddSchoolGroupFormComponent implements OnInit {
  public formGroup!: FormGroup;
  public $schoolsListView = new BehaviorSubject<HtmlSelectOption[]>([]);
  constructor(
    private dialogCdk: Dialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSchoolGroupFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      schoolGroupInput: HTMLInputElement;
      radioButtonElement: HTMLSpanElement;
      title: string;
      addSchoolButton: HTMLInputElement;
      schoolListView: HTMLSelectElement;
    }
  ) {}
  private createFormGroup() {
    this.formGroup = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      status: this.fb.control('Active', [Validators.required]),
      selectedSchools: [[]],
    });
  }
  private nameChanged() {
    this.name.valueChanges.subscribe({
      next: (value) => {
        this.data.schoolGroupInput.value = value;
      },
    });
  }
  private updateRadioButtonWhere(
    inputs: HTMLCollectionOf<HTMLInputElement>,
    value: string
  ) {
    for (let i = 0; i < inputs.length; i++) {
      let radio = inputs[i];
      if (radio.value === value) {
        radio.checked = true;
        break;
      }
    }
  }
  private statusChanged() {
    this.status.valueChanges.subscribe({
      next: (value) => {
        let inputs = this.data.radioButtonElement.getElementsByTagName('input');
        this.updateRadioButtonWhere(inputs, value);
      },
    });
  }
  private selectedSchoolsChanged() {
    this.selectedSchools.valueChanges.subscribe({
      next: (values: string[]) => {
        let selects = this.data.schoolListView.options;
        for (let i = 0; i < selects.length; i++) {
          let select = selects[i];
          if (values.includes(select.value)) {
            select.selected = true;
          }
        }
      },
    });
  }
  private openConfirmDialog() {
    let dialogRef = this.dialogCdk.open(ConfirmMessageBoxComponent, {
      minWidth: '300px',
      data: {
        title: 'Add School Group',
        message: 'Are you sure you want to save changes?',
      },
    });
    dialogRef.componentInstance?.closeClicked.asObservable().subscribe({
      next: () => {
        dialogRef.close();
      },
    });
    dialogRef.componentInstance?.confirmClicked.asObservable().subscribe({
      next: () => {
        dialogRef.close();
        this.data.addSchoolButton.click();
      },
    });
  }
  private readRegisteredSchoolList() {
    let schoolsList = AppUtilities.getSelectOptionsAsArray(
      this.data.schoolListView
    );
    this.$schoolsListView.next(schoolsList);
  }
  ngOnInit(): void {
    if (!this.data.schoolGroupInput || !this.data.radioButtonElement)
      throw Error('Cannot find school group input client.');
    this.createFormGroup();
    this.nameChanged();
    this.statusChanged();
    this.selectedSchoolsChanged();
    this.readRegisteredSchoolList();
  }
  submitSchoolGroupForm() {
    setTimeout(() => {
      if (this.formGroup.invalid) {
        this.formGroup.markAllAsTouched();
      } else {
        this.openConfirmDialog();
      }
    }, 100);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  get name() {
    return this.formGroup.get('name') as FormControl;
  }
  get status() {
    return this.formGroup.get('status') as FormControl;
  }
  get selectedSchools() {
    return this.formGroup.get('selectedSchools') as FormControl;
  }
}
