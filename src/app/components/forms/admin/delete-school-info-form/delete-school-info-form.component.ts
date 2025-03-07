import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { defaultIfEmpty, Observable, of, zip } from 'rxjs';
import { EUpdateSchool as EDeleteSchool } from 'src/app/core/enums/admin/register-school-form-enum';
import { OnGenericComponent } from 'src/app/core/interfaces/on-generic-component';
import { RegisterSchoolFormData } from 'src/app/core/interfaces/register-school-form-data';
import { HasFormControlErrorPipe } from 'src/app/core/pipes/has-form-control-error/has-form-control-error.pipe';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { LanguageService } from 'src/app/core/services/language-service/language.service';
import { RegisterSchoolFormService } from 'src/app/core/services/register-school-form/register-school-form.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { AppUtilities } from 'src/app/utilities/app-utilities';

@Component({
  selector: 'app-delete-school-info-form',
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
  templateUrl: './delete-school-info-form.component.html',
  styleUrl: './delete-school-info-form.component.scss',
})
export class DeleteSchoolInfoFormComponent
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
  registerIcons() {
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
        Object.keys(EDeleteSchool).filter((key) => isNaN(Number(key))).length
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
  onSubmitForm(event: MouseEvent) {}
  resetForm(event: MouseEvent) {}
}
