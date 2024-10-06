import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { WarnMessageBoxComponent } from '../../../dialogs/warn-message-box/warn-message-box.component';
import { ConfirmMessageBoxComponent } from '../../../dialogs/confirm-message-box/confirm-message-box.component';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { BehaviorSubject } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { AppUtilities } from 'src/app/utilities/app-utilities';

@Component({
  selector: 'app-edit-school-group-form',
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
  templateUrl: './edit-school-group-form.component.html',
  styleUrl: './edit-school-group-form.component.scss',
})
export class EditSchoolGroupFormComponent implements OnInit {
  public formGroup!: FormGroup;
  public editClicked = new EventEmitter<void>();
  public $schoolsListView = new BehaviorSubject<HtmlSelectOption[]>([]);
  constructor(
    private dialogCdk: Dialog,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSchoolGroupFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      schoolGroupInput: HTMLInputElement;
      radioButtonElement: HTMLSpanElement;
      editSchoolButton: HTMLInputElement;
      title: string;
      schoolListView: HTMLSelectElement;
    }
  ) {}
  private createEditFormGroup() {
    this.formGroup = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      status: this.fb.control('', [Validators.required]),
      selectedSchools: [[]],
    });
  }
  private parseEditForm() {
    this.initializeRadioButton();
    this.initializeSchoolGroupName();
  }
  private initializeRadioButton() {
    let inputs = this.data.radioButtonElement.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      let radio = inputs[i];
      if (radio.checked) {
        this.status.setValue(radio.value);
      }
    }
  }
  private initializeSchoolGroupName() {
    this.name.setValue(this.data.schoolGroupInput.value);
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
        console.log(inputs);
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
  private readRegisteredSchoolList() {
    let schoolsList = AppUtilities.getSelectOptionsAsArray(
      this.data.schoolListView
    );
    this.$schoolsListView.next(schoolsList);
  }
  ngOnInit(): void {
    if (!this.data.schoolGroupInput || !this.data.radioButtonElement)
      throw Error('Cannot find school group input client.');
    this.createEditFormGroup();
    this.parseEditForm();
    this.nameChanged();
    this.statusChanged();
    this.selectedSchoolsChanged();
    this.readRegisteredSchoolList();
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submitEditSchoolGroupForm() {
    setTimeout(() => {
      if (this.formGroup.invalid) {
        this.formGroup.markAllAsTouched();
        return;
      }
      let dialogRef = this.dialogCdk.open(ConfirmMessageBoxComponent, {
        minWidth: '300px',
        data: {
          title: 'Edit School Group',
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
          this.data.editSchoolButton.click();
        },
      });
    }, 100);
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
