import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BehaviorSubject,
  defaultIfEmpty,
  Observable,
  of,
  Subject,
  Subscription,
  takeUntil,
  zip,
} from 'rxjs';
import { EUpdateSchool } from 'src/app/core/enums/admin/register-school-form-enum';
import {
  AccoountDetailsFormInputs,
  UpdateSchoolFormActions,
  UpdateSchoolFormInputs,
} from 'src/app/core/interfaces/form-inputs/register-school-form-inputs';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { Dialog, DIALOG_DATA, DialogModule } from '@angular/cdk/dialog';
import { ConfirmMessageBoxComponent } from 'src/app/components/dialogs/confirm-message-box/confirm-message-box.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { RegisterSchoolFormService } from 'src/app/core/services/register-school-form/register-school-form.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { OnGenericComponent } from 'src/app/core/interfaces/on-generic-component';
import { RegisterSchoolFormData } from 'src/app/core/interfaces/register-school-form-data';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-update-school-info-form',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatIconModule,
        TranslateModule,
        HasFormControlErrorPipe,
        MatDividerModule,
    ],
    templateUrl: './update-school-info-form.component.html',
    styleUrl: './update-school-info-form.component.scss'
})
export class UpdateSchoolInfoFormComponent
  implements AfterViewInit, OnGenericComponent
{
  AppUtilities: typeof AppUtilities = AppUtilities;
  @Input('keys') keys: string = '';
  @Input('account-details') accountDetails: any;
  ids$!: Observable<MElementPair>;
  formData!: RegisterSchoolFormData;
  constructor(
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    public registerService: RegisterSchoolFormService,
    private langService: LanguageService
  ) {
    this.registerIcons();
    this.registerService.createUpdateSchoolFormGroup();
  }
  private createFormData() {
    try {
      const forms = zip(
        this.registerService.branchName$,
        this.registerService.countries$,
        this.registerService.region$,
        this.registerService.districts$,
        this.registerService.ward$,
        this.registerService.currencies$.pipe(
          defaultIfEmpty(document.createElement('select'))
        ),
        this.registerService.schoolNames$
      );
      forms.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
        next: (res) => {
          const [
            branchName,
            countries,
            region,
            districts,
            ward,
            currencies,
            schoolNames,
          ] = res;
          console.log(res);
          const makeFormData = () => {
            this.formData = {
              branchesList$: of(
                this.domService.getSelectOptionsAsArray(branchName)
              ),
              countriesList$: of(
                this.domService.getSelectOptionsAsArray(countries)
              ),
              regionsList$: of(this.domService.getSelectOptionsAsArray(region)),
              districtsList$: of(
                this.domService.getSelectOptionsAsArray(districts)
              ),
              wardsList$: of(this.domService.getSelectOptionsAsArray(ward)),
              currencies$: of(
                this.domService.getSelectOptionsAsArray(
                  currencies as HTMLSelectElement
                )
              ),
              schoolNames$: of(
                this.domService.getSelectOptionsAsArray(
                  schoolNames as HTMLSelectElement
                )
              ),
            };
          };
          branchName &&
            countries &&
            region &&
            districts &&
            ward &&
            currencies &&
            makeFormData();
        },
        error: (e) => console.error(e),
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }
  registerIcons(): void {
    const icons = ['plus-lg', 'trash'];
    this._appConfig.addIcons(icons, '../assets/assets/icons');
  }
  ngAfterViewInit(): void {
    this.initIds();
    this.createFormData();
  }
  initIds(): void {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(EUpdateSchool).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.registerService.ids$ = this.ids$;
    this.registerService.accountDetails = this.accountDetails;
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers(): void {
    this.registerService.initFormControls();
    this.registerService.attachValueChanges();
  }
  addBankDetail(event: MouseEvent, index: number) {
    this.registerService.addAccountDetailButton$.subscribe({
      next: (btn) => btn && this.domService.clickButton(btn),
      error: (e) => console.error(e),
    });
  }
  removeBankDetail(event: MouseEvent, index: number) {
    const control = this.registerService.details.controls
      .at(index)
      ?.get('removeButton') as FormControl<HTMLLinkElement | null>;
    control.value && control.value.click();
  }
  onSubmitForm(event: Event) {
    const clickSubmit = () => {
      this.registerService.registerSchoolButton$.subscribe({
        next: (button) => this.domService.clickButton(button),
        error: (e) => console.error(e),
      });
    };
    const confirmMessage = (dialog: ConfirmMessageBoxComponent) => {
      dialog.confirmClicked
        .asObservable()
        .pipe(this.unsubscribe.takeUntilDestroy)
        .subscribe({
          next: () => clickSubmit(),
          error: (e) => console.error(e),
        });
    };
    const openConfirmationDialog = () => {
      const dialogRef$ = this._appConfig.openConfirmationDialog(
        'registerSchool.labels.updateSchool',
        'defaults.saveChanges'
      );
      dialogRef$.subscribe({
        next: (dialog) => dialog && confirmMessage(dialog.componentInstance),
        error: (e) => console.error(e),
      });
    };
    this.registerService.formGroup.valid && openConfirmationDialog();
    this.registerService.formGroup.markAllAsTouched();
  }
  resetForm(event: MouseEvent) {
    this.registerService.formGroup.reset();
  }
}
