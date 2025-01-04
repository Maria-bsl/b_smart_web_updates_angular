import { AfterViewInit, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';
import { map, Observable } from 'rxjs';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { EPaymentDetailsReport } from 'src/app/core/enums/pat-det-rep.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';

@Component({
  selector: 'app-payment-details-form',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    //MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './payment-details-form.component.html',
  styleUrl: './payment-details-form.component.scss',
})
export class PaymentDetailsFormComponent
  implements OnGenericComponent, AfterViewInit
{
  formGroup!: FormGroup;
  keys!: string;
  ids$!: Observable<MElementPair>;
  constructor(
    private _appConfig: AppConfigService,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private fb: FormBuilder,
    private tr: TranslateService
  ) {
    this._appConfig.initLanguage();
    this.registerIcons();
    this.registerIcons();
    this.createFormGroup();
  }
  private createFormGroup() {
    this.formGroup = this.fb.group({
      zone: this.fb.control('', []),
      school: this.fb.control('', []),
      fee: this.fb.control('', []),
      paymentClass: this.fb.control('', []),
      stream: this.fb.control('', []),
      admissionNo: this.fb.control('', []),
      referenceNo: this.fb.control('', []),
      currency: this.fb.control('', []),
      dateFrom: this.fb.control('', [Validators.required]),
      dateTo: this.fb.control('', [Validators.required]),
    });
  }
  private initFormControls() {}
  initIds(): void {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(EPaymentDetailsReport).filter((key) => isNaN(Number(key)))
          .length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers(): void {
    this.initFormControls();
  }
  registerIcons(): void {
    const icons = ['pdf-icon', 'icons8-excel'];
    this._appConfig.addIcons(icons, '/assets/icons');
  }
  ngAfterViewInit(): void {
    this.initIds();
  }
  get dateFrom$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.DATE_FROM) as HTMLInputElement)
    );
  }
  get dateTo$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.DATE_TO) as HTMLInputElement)
    );
  }
  get zone$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.ZONE) as HTMLInputElement)
    );
  }
  get fee$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.FEE) as HTMLInputElement)
    );
  }
  get classDetails$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.CLASS) as HTMLInputElement)
    );
  }
  get stream$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(EPaymentDetailsReport.STREAM_COMBINATION) as HTMLInputElement
      )
    );
  }
  get admissionNo$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) => el.get(EPaymentDetailsReport.ADMISSION_NO) as HTMLInputElement
      )
    );
  }
  get referenceNo$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) => el.get(EPaymentDetailsReport.REFERENCE_NO) as HTMLInputElement
      )
    );
  }
}
