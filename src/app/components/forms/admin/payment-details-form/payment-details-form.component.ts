import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DATE_FORMATS,
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
import { map, Observable, of } from 'rxjs';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { EPaymentDetailsReport } from 'src/app/core/enums/pat-det-rep.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { HtmlSelectOption } from 'src/app/core/interfaces/helpers/data/html-select-option';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DATE_PICKER_FORMATS } from 'src/app/utilities/app-consts';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-payment-details-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTableModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatDividerModule,
  ],
  providers: [
    DatePipe,
    provideNativeDateAdapter(),
    provideMomentDateAdapter(DATE_PICKER_FORMATS),
  ],
  templateUrl: './payment-details-form.component.html',
  styleUrl: './payment-details-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailsFormComponent
  implements OnGenericComponent, AfterViewInit
{
  formGroup!: FormGroup;
  @Input('keys') keys!: string;
  @Input('table-data') tableData: string = '';
  ids$!: Observable<MElementPair>;
  templateData: {
    zoneList$: Observable<HtmlSelectOption[]>;
    schoolList$: Observable<HtmlSelectOption[]>;
    feesList$: Observable<HtmlSelectOption[]>;
    streamList$: Observable<HtmlSelectOption[]>;
    paymentClasses$: Observable<HtmlSelectOption[]>;
    currencies$: Observable<HtmlSelectOption[]>;
  } = {
    zoneList$: of([]),
    schoolList$: of([]),
    feesList$: of([]),
    paymentClasses$: of([]),
    streamList$: of([]),
    currencies$: of([]),
  };
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  tableDisplayedColumns: string[] = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
  ];
  tableFormGroup!: FormGroup;
  constructor(
    private _appConfig: AppConfigService,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private fb: FormBuilder,
    private tr: TranslateService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this._appConfig.initLanguage();
    this.registerIcons();
    this.createFormGroup();
    this.createTableFormGroup();
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
  private createTableFormGroup() {
    this.tableFormGroup = this.fb.group({
      tableSearch: this.fb.control('', []),
    });
  }
  private initZone() {
    const populateOptions = (select: HTMLSelectElement) => {
      if (!AppUtilities.isValueEmptyElement(select)) {
        this.zone.setValue(select.value);
      }
      if (this.templateData) {
        let listView = this.domService.getSelectOptionsAsArray(select);
        this.templateData.zoneList$ = of(listView);
      }
    };
    this.zone$.subscribe({
      next: (select) => populateOptions(select),
      error: (err) => console.error(err.message),
    });
  }
  private initSchool() {
    const populateOptions = (select: HTMLSelectElement) => {
      if (!AppUtilities.isValueEmptyElement(select)) {
        this.school.setValue(select.value);
      }
      if (this.templateData) {
        let listView = this.domService.getSelectOptionsAsArray(select);
        this.templateData.schoolList$ = of(listView);
      }
    };
    this.school$.subscribe({
      next: (select) => populateOptions(select),
      error: (err) => console.error(err.message),
    });
  }
  private initFees() {
    const populateOptions = (select: HTMLSelectElement) => {
      if (!AppUtilities.isValueEmptyElement(select)) {
        this.fee.setValue(select.value);
      }
      if (this.templateData) {
        let listView = this.domService.getSelectOptionsAsArray(select);
        this.templateData.feesList$ = of(listView);
      }
    };
    this.fee$.subscribe({
      next: (select) => populateOptions(select),
      error: (err) => console.error(err.message),
    });
  }
  private initStudentClass() {
    const populateOptions = (select: HTMLSelectElement) => {
      if (!AppUtilities.isValueEmptyElement(select)) {
        this.paymentClass.setValue(select.value);
      }
      if (this.templateData) {
        let listView = this.domService.getSelectOptionsAsArray(select);
        this.templateData.paymentClasses$ = of(listView);
      }
    };
    this.classDetails$.subscribe({
      next: (val) => populateOptions(val),
      error: (err) => console.error(err.message),
    });
  }
  private initStream() {
    const populateOptions = (select: HTMLSelectElement) => {
      if (!AppUtilities.isValueEmptyElement(select)) {
        this.stream.setValue(select.value);
      }
      if (this.templateData) {
        let listView = this.domService.getSelectOptionsAsArray(select);
        this.templateData.streamList$ = of(listView);
      }
    };
    this.stream$.subscribe({
      next: (val) => populateOptions(val),
      error: (err) => console.error(err.message),
    });
  }
  private initAdmissionNo() {
    this.admissionNo$.subscribe({
      next: (input) => this.admissionNo.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initReferenceNo() {
    this.referenceNo$.subscribe({
      next: (input) => this.referenceNo.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initCurrency() {
    const populateOptions = (select: HTMLSelectElement) => {
      if (!AppUtilities.isValueEmptyElement(select)) {
        this.currency.setValue(select.value);
      }
      if (this.templateData) {
        let listView = this.domService.getSelectOptionsAsArray(select);
        this.templateData.paymentClasses$ = of(listView);
      }
    };
    this.currency$.subscribe({
      next: (val) => populateOptions(val),
      error: (err) => console.error(err.message),
    });
  }
  private initDateFrom() {
    this.dateFrom$.subscribe({
      next: (input) => this.dateFrom.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private initDateTo() {
    this.dateTo$.subscribe({
      next: (input) => this.dateFrom.setValue(input.value),
      error: (err) => console.error(err.message),
    });
  }
  private zoneValueChanges() {
    const subscribe = (value: string) => {
      this.zone$.subscribe({
        next: (select) =>
          (select.value = value) &&
          this.domService.dispatchSelectElementChangeEvent(select),
        error: (err) => console.error(err.message),
      });
    };
    this.zone.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => subscribe(value),
      error: (err) => console.error(err.message),
    });
  }
  private schoolValueChanges() {
    const subscribe = (value: string) => {
      this.school$.subscribe({
        next: (select) =>
          (select.value = value) &&
          this.domService.dispatchSelectElementChangeEvent(select),
        error: (err) => console.error(err.message),
      });
    };
    this.school.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => subscribe(value),
      error: (err) => console.error(err.message),
    });
  }
  private feeValueChanges() {
    const subscribe = (value: string) => {
      this.fee$.subscribe({
        next: (select) =>
          (select.value = value) &&
          this.domService.dispatchSelectElementChangeEvent(select),
        error: (err) => console.error(err.message),
      });
    };
    this.fee.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => subscribe(value),
      error: (err) => console.error(err.message),
    });
  }
  private studentClassValueChanges() {
    const subscribe = (value: string) => {
      this.classDetails$.subscribe({
        next: (select) =>
          (select.value = value) &&
          this.domService.dispatchSelectElementChangeEvent(select),
        error: (err) => console.error(err.message),
      });
    };
    this.paymentClass.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private streamValueChanges() {
    const subscribe = (value: string) => {
      this.stream$.subscribe({
        next: (select) =>
          (select.value = value) &&
          this.domService.dispatchSelectElementChangeEvent(select),
        error: (err) => console.error(err.message),
      });
    };
    this.stream.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => subscribe(value),
      error: (err) => console.error(err.message),
    });
  }
  private admissionNoValueChanges() {
    const subscribe = (value: string) => {
      this.admissionNo$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.admissionNo.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private referenceNoValueChanges() {
    const subscribe = (value: string) => {
      this.referenceNo$.subscribe({
        next: (userInput) => (userInput.value = value),
        error: (err) => console.error(err.message),
      });
    };
    this.referenceNo.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private currencyValueChanges() {
    const subscribe = (value: string) => {
      this.currency$.subscribe({
        next: (select) =>
          (select.value = value) &&
          this.domService.dispatchSelectElementChangeEvent(select),
        error: (err) => console.error(err.message),
      });
    };
    this.currency.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => subscribe(value),
        error: (err) => console.error(err.message),
      });
  }
  private dateFromValueChanges() {
    const subscribe = (value: any) => {
      this.dateFrom$.subscribe({
        next: (dateInput) => {
          let date = this.datePipe.transform(value.toDate(), 'MM/dd/YYYY');
          date && (dateInput.value = date);
        },
        error: (err) => console.error(err.message),
      });
    };
    this.dateFrom.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => {
          subscribe(value);
        },
        error: (err) => console.error(err.message),
      });
  }
  private dateToValueChanges() {
    const subscribe = (value: any) => {
      this.dateTo$.subscribe({
        next: (dateInput) => {
          let date = this.datePipe.transform(value.toDate(), 'MM/dd/YYYY');
          date && (dateInput.value = date);
        },
        error: (err) => console.error(err.message),
      });
    };
    this.dateTo.valueChanges.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (value) => {
        subscribe(value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private initFormControls() {
    this.initZone();
    this.initSchool();
    this.initFees();
    this.initStudentClass();
    this.initStream();
    this.initAdmissionNo();
    this.initReferenceNo();
    this.initCurrency();
    this.initDateFrom();
    this.initDateTo();
  }
  private formControlEvents() {
    this.zoneValueChanges();
    this.schoolValueChanges();
    this.feeValueChanges();
    this.studentClassValueChanges();
    this.streamValueChanges();
    this.admissionNoValueChanges();
    this.referenceNoValueChanges();
    this.currencyValueChanges();
    this.dateFromValueChanges();
    this.dateToValueChanges();
  }
  private tableSearchEventHandler() {
    this.tableSearch.valueChanges
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (value) => {
          value && (this.dataSource.filter = value.trim().toLocaleLowerCase());
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        },
        error: (err) => console.error(err.message),
      });
  }
  private createPaymentTable() {
    try {
      const STUDENT_NAME_INDEX = '5';
      const dataset = JSON.parse(this.tableData);
      //const dataset = [];
      this.dataSource = new MatTableDataSource<any>(dataset);
      const filterPredicate = (data: any, filter: string) => {
        return data[STUDENT_NAME_INDEX].toLocaleLowerCase().includes(
          filter.toLocaleLowerCase()
        )
          ? true
          : false;
      };
      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = filterPredicate;
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }
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
    this.formControlEvents();
  }
  registerIcons(): void {
    const icons = ['pdf-icon', 'icons8-excel'];
    this._appConfig.addIcons(icons, '/assets/icons');
    const feathers = ['search'];
    this._appConfig.addIcons(feathers, '/assets/feather');
  }
  ngAfterViewInit(): void {
    this.initIds();
    this.createPaymentTable();
    this.tableSearchEventHandler();
  }
  viewReportClicked(event: MouseEvent) {
    const onClick = () => {
      this.viewReport$.subscribe({
        next: (el) => this.domService.clickButton(el),
        error: (err) => console.error(err.message),
      });
    };
    if (this.formGroup.valid) {
      onClick();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  downloadPdfClicked(event: MouseEvent) {
    if (this.formGroup.valid) {
      this.downloadPdf$.subscribe({
        next: (el) => this.domService.clickButton(el),
        error: (err) => console.error(err.message),
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
  downloadExcelClicked(event: MouseEvent) {
    if (this.formGroup.valid) {
      this.downloadExcel$.subscribe({
        next: (el) => this.domService.clickButton(el),
        error: (err) => console.error(err.message),
      });
    } else {
      this.formGroup.markAllAsTouched();
    }
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
      map((el) => el.get(EPaymentDetailsReport.ZONE) as HTMLSelectElement)
    );
  }
  get school$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.SCHOOL) as HTMLSelectElement)
    );
  }
  get fee$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.FEE) as HTMLSelectElement)
    );
  }
  get classDetails$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.CLASS) as HTMLSelectElement)
    );
  }
  get stream$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(EPaymentDetailsReport.STREAM_COMBINATION) as HTMLSelectElement
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
  get currency$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(EPaymentDetailsReport.CURRENCY) as HTMLSelectElement)
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
  get viewReport$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(EPaymentDetailsReport.VIEW_REPORT_BUTTON) as HTMLInputElement
      )
    );
  }
  get downloadPdf$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(EPaymentDetailsReport.DOWNLOAD_PDF_BUTTON) as HTMLInputElement
      )
    );
  }
  get downloadExcel$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map(
        (el) =>
          el.get(
            EPaymentDetailsReport.DOWNLOAD_EXCEL_BUTTON
          ) as HTMLInputElement
      )
    );
  }
  get zone() {
    return this.formGroup.get('zone') as FormControl;
  }
  get school() {
    return this.formGroup.get('school') as FormControl;
  }
  get fee() {
    return this.formGroup.get('fee') as FormControl;
  }
  get paymentClass() {
    return this.formGroup.get('paymentClass') as FormControl;
  }
  get stream() {
    return this.formGroup.get('stream') as FormControl;
  }
  get admissionNo() {
    return this.formGroup.get('admissionNo') as FormControl;
  }
  get referenceNo() {
    return this.formGroup.get('referenceNo') as FormControl;
  }
  get currency() {
    return this.formGroup.get('currency') as FormControl;
  }
  get dateFrom() {
    return this.formGroup.get('dateFrom') as FormControl;
  }
  get dateTo() {
    return this.formGroup.get('dateTo') as FormControl;
  }
  get tableSearch() {
    return this.tableFormGroup.get('tableSearch') as FormControl;
  }
}
