import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { firstValueFrom, fromEvent, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
// import Highcharts from 'highcharts';
import * as Highcharts from 'highcharts';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { DashboardForm } from 'src/app/core/enums/admin/dashboard.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';

type CustomChartType = {
  updateFromInput?: boolean;
  chartConstructor?: string;
  Highcharts: any;
  chartCallback?: any | null;
  chartOptions: Highcharts.Options;
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    HighchartsChartModule,
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatRippleModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
  animations: [inOutAnimation],
})
export class DashboardPageComponent implements AfterViewInit, OnChanges {
  totalSchools = signal<string>('0');
  activeSchool = signal<string>('0');
  billsIssued = signal<string>('0');
  students = signal<string>('0');
  users = signal<string>('0');
  bankUsers = signal<string>('0');
  schoolUsers = signal<string>('0');
  collectedAmount = signal<string>('0');
  today = new Date();
  //('blocked') blocked= signal<string>('');
  @Input('keys') keys: string = '';
  @Input('is-modern') isModern: 'true' | 'false' = 'true';
  activeSchoolsChart!: CustomChartType;
  customChartType!: CustomChartType;
  blockedUsers$!: Observable<string[]>;
  currentIndex = signal<number>(0);
  timePeriodIndexes$ = of([0, 3, 6]);
  @ViewChild('circle') circle!: ElementRef<HTMLDivElement>;
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private cdr: ChangeDetectorRef
  ) {
    this.tr.addLangs(['en', 'sw']);
    this.tr.setDefaultLang('en');
    this.tr.use('en');
    this.registerIcons();
    this.initChart();
    this.initActiveSchoolsChart();
  }
  private initActiveSchoolsChart() {
    this.activeSchoolsChart = {
      updateFromInput: true,
      Highcharts: Highcharts,
      chartOptions: {
        chart: {
          type: 'pie',
        },
        title: {
          text: 'Sample Chart',
        },
        series: [
          {
            name: 'Data',
            type: 'line',
            data: [1, 2, 3, 4, 5],
          },
        ],
      },
    };
  }
  private async initChart() {
    this.customChartType = {
      updateFromInput: true,
      Highcharts: Highcharts,
      chartOptions: {
        chart: {
          height: 350,
        },
        series: [
          {
            name: await firstValueFrom(
              this.tr.get('dashboardPage.labels.billsIssued')
            ),
            type: 'line',
            data: [1, 2, 3, 4],
          },
          {
            name: await firstValueFrom(
              this.tr.get('dashboardPage.labels.paidInvoices')
            ),
            type: 'line',
            data: [1, 3, 4, 3, 5],
          },
          {
            name: await firstValueFrom(
              this.tr.get('dashboardPage.labels.pendingInvoices')
            ),
            type: 'line',
            data: [4, 6, 7, 5, 8],
          },
        ],
      },
    };
  }
  private registerIcons() {
    let icons = ['hut', 'airplay'];
    this.appConfig.addIcons(icons, '/assets/icons');
  }
  private changeEventHandler(
    htmlInput: HTMLInputElement,
    input: WritableSignal<string>
  ) {
    fromEvent(htmlInput, 'change')
      .pipe(this.unsubscribe.takeUntilDestroy)
      .subscribe({
        next: (e: any) => input.set(e.target.value),
        error: (err) => console.error(err),
      });
  }
  private parseTotalSchools() {
    const totalSchools$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.TOTAL_SCHOOLS
    );
    totalSchools$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.totalSchools);
        this.totalSchools.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseActiveSchools() {
    const activeSchools$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.ACTIVE_SCHOOLS
    );
    activeSchools$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.activeSchool);
        this.activeSchool.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseBillsIssued() {
    const billsIssued$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.BILLS_ISSUED
    );
    billsIssued$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.billsIssued);
        this.billsIssued.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseStudents() {
    const students$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.STUDENTS
    );
    students$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.students);
        this.students.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseUsers() {
    const users$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.USERS
    );
    users$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.users);
        this.users.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseBankUsers() {
    const bankUsers$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.BANK_USERS
    );
    bankUsers$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.bankUsers);
        this.bankUsers.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseSchoolUsers() {
    const schoolUsers$ = this.domService.getElementAtIndex<HTMLInputElement>(
      DashboardForm.SCHOOL_USERS
    );
    schoolUsers$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.schoolUsers);
        this.schoolUsers.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private parseCollectedAmount() {
    const collectedAmount$ =
      this.domService.getElementAtIndex<HTMLInputElement>(
        DashboardForm.COLLECTED_AMOUNT
      );
    collectedAmount$.subscribe({
      next: (htmlInput) => {
        this.changeEventHandler(htmlInput, this.collectedAmount);
        this.collectedAmount.set(htmlInput.value);
      },
      error: (err) => console.error(err.message),
    });
  }
  private attachEventHandlers() {
    this.parseTotalSchools();
    this.parseActiveSchools();
    this.parseBillsIssued();
    this.parseStudents();
    this.parseUsers();
    this.parseBankUsers();
    this.parseSchoolUsers();
    this.parseCollectedAmount();
  }
  activeSchoolsPercentage() {
    const percentage =
      (parseInt(this.activeSchool()) / parseInt(this.totalSchools())) * 100;
    //let percent = percentage;
    this.circle.nativeElement.style.setProperty(
      '--percentage',
      `${percentage.toFixed(0)}%`
    );

    // effect(() => {
    //   let percentage =
    //     (parseInt(this.activeSchool()) / parseInt(this.totalSchools())) * 100;
    //   let percent = percentage;
    //   this.circle.nativeElement.style.setProperty(
    //     '--percentage',
    //     `${percent}%`
    //   );
    // });
  }
  ngAfterViewInit(): void {
    this.domService.parseDocumentKeys(
      this.keys,
      Object.keys(DashboardForm).filter((key) => isNaN(Number(key))).length
    );
    this.attachEventHandlers();
    this.activeSchoolsPercentage();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.domService.parseDocumentKeys(
      this.keys,
      Object.keys(DashboardForm).filter((key) => isNaN(Number(key))).length
    );
    this.attachEventHandlers();
  }
}
