import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { DesignationTableComponent } from 'src/app/components/templates/admin/setup/designation-table/designation-table.component';
import { EAcademicSetup } from 'src/app/core/enums/admin/setup/academic-setup.enum';
import { EDesignationSetup } from 'src/app/core/enums/admin/setup/designation-setup.enum';
import {
  AcademicService,
  THtmlElementControls,
} from 'src/app/core/services/admin/setup/academic/academic.service';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';

@Component({
<<<<<<< HEAD
    selector: 'app-designation-setup',
    imports: [
        DesignationTableComponent,
        TranslateModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './designation-setup.component.html',
    styleUrl: './designation-setup.component.scss',
    animations: [inOutAnimation]
=======
  selector: 'app-designation-setup',
  standalone: true,
  imports: [
    DesignationTableComponent,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './designation-setup.component.html',
  styleUrl: './designation-setup.component.scss',
  animations: [inOutAnimation],
>>>>>>> eb465d57eeec39fca151ad86e20fd4337434531a
})
export class DesignationSetupComponent implements AfterViewInit {
  @Input('keys') keys: string = '';
  @Input('designation-table') jsonTable: string = '';
  @ViewChild('designationTable') setupTable!: DesignationTableComponent;
  private _formGroup!: FormGroup;
  private _copyFormGroup!: FormGroup;
  private _ids$!: Observable<MElementPair>;
  constructor(
    private _dom: ElementDomManipulationService,
    private languageService: LanguageService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _fb: FormBuilder
  ) {
    this.languageService.changeLanguage(
      localStorage.getItem('currentLang') ?? 'en'
    );
    this.createFormGroup();
  }
  private createFormGroup() {
    const formGroup = () => {
      return this._fb.group({
        designationName: this._fb.control('', [Validators.required]),
      });
    };
    this._formGroup = formGroup();
    this._copyFormGroup = formGroup();
  }
  private initIds(): void {
    this._ids$ = this._dom.createIds(this.keys, EDesignationSetup);
    const registerControls = () => {
      const controls: THtmlElementControls[] = [
        [this.designationName$, this.designationName],
      ];
      const events = this._dom.registerFormControls(controls);
      events.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        error: (e) => console.error(e),
        complete: () => this._copyFormGroup.setValue(this.formGroup.value),
      });
    };
    registerControls();
  }
  private handlers() {
    const deselectRowsHandler = () => {
      this.setupTable.deselectedAllRows
        .asObservable()
        .pipe(
          switchMap(() => this.cancelButton$),
          this.unsubscribe.takeUntilDestroy
        )
        .subscribe(this._dom.clickButton);
    };
    const deleteRow = () => {
      this.setupTable.deleteRow
        .asObservable()
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          switchMap(() =>
            this._appConfig.openConfirmationDialog(
              'defaults.delete',
              'defaults.thisCannotBeUndone'
            )
          ),
          switchMap((dialogRef) =>
            dialogRef.componentInstance.confirmClicked.asObservable()
          ),
          switchMap(() => this.deleteButton$)
        )
        .subscribe(this._dom.clickButton);
    };
    deselectRowsHandler();
    deleteRow();
  }
  ngAfterViewInit(): void {
    this.initIds();
    this.handlers();
  }
  resetForm(event: MouseEvent) {
    event.preventDefault();
    this._formGroup.setValue(this._copyFormGroup.value);
  }
  submitForm(event: MouseEvent) {
    event.preventDefault();
    const isUpdate = this.setupTable.selection.hasValue();
    const confirmMessage$ = () => {
      const title = isUpdate ? 'defaults.update' : 'defaults.create';
      return this._appConfig.openConfirmationDialog(
        title,
        'defaults.saveChanges'
      );
    };
    if (this.formGroup.valid) {
      confirmMessage$()
        .pipe(
          this.unsubscribe.takeUntilDestroy,
          switchMap((dialogRef) =>
            dialogRef.componentInstance.confirmClicked.asObservable()
          ),
          switchMap(() => (isUpdate ? this.updateButton$ : this.createButton$))
        )
        .subscribe(this._dom.clickButton);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  get formGroup() {
    return this._formGroup;
  }
  get designationName$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDesignationSetup.DESIGNATION_TEXTFIELD
    );
  }
  get cancelButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDesignationSetup.CANCEL_BUTTON
    );
  }
  get createButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDesignationSetup.CREATE_BUTTON
    );
  }
  get updateButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDesignationSetup.UPDATE_BUTTON
    );
  }
  get deleteButton$() {
    return this._dom.getDomElement$<HTMLInputElement>(
      this._ids$,
      EDesignationSetup.DELETE_BUTTON
    );
  }
  get designationName() {
    return this._formGroup.get('designationName') as FormControl;
  }
}
