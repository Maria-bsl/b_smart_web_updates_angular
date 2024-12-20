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
import {
  firstValueFrom,
  fromEvent,
  lastValueFrom,
  map,
  Observable,
  of,
  zip,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
// import Highcharts from 'highcharts';
import * as Highcharts from 'highcharts';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { DashboardForm } from 'src/app/core/enums/admin/dashboard.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { inOutAnimation } from 'src/app/shared/animations/in-out-animation';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';

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
export class DashboardPageComponent
  implements AfterViewInit, OnChanges, OnGenericComponent
{
  @Input('keys') keys: string = '';
  @Input('is-modern') isModern: 'true' | 'false' = 'true';
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
  activeSchoolsChart!: CustomChartType;
  customChartType!: CustomChartType;
  blockedUsers$!: Observable<string[]>;
  currentIndex = signal<number>(0);
  timePeriodIndexes$ = of([0, 3, 6]);
  ids$!: Observable<MElementPair>;
  //@ViewChild('circle') circle!: ElementRef<HTMLDivElement>;
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
    this.initActiveSchoolsChart();
  }
  private initActiveSchoolsChart(
    totalSchools: string = '',
    activeSchools: string = ''
  ) {
    !AppUtilities.isStringNumber(this.totalSchools()) &&
      console.error('Total schools data is not a number');
    !AppUtilities.isStringNumber(this.activeSchool()) &&
      console.error('Active schools data is not a number');

    const createChart = () => {
      this.activeSchoolsChart = {
        updateFromInput: true,
        Highcharts: Highcharts,
        chartOptions: {
          credits: {
            enabled: false,
          },
          chart: {
            type: 'pie',
            height: 150,
            width: 150,
            backgroundColor: 'transparent',
          },
          title: {
            text: `${this.activeSchool()}%`,
            align: 'center',
            verticalAlign: 'middle',
            style: {
              fontSize: '16px',
            },
          },
          plotOptions: {
            pie: {
              innerSize: '80%', // Creates the doughnut effect
              dataLabels: {
                enabled: false,
              },
              startAngle: -90,
              endAngle: 90,
              center: ['50%', '75%'],
            },
          },
          series: [
            {
              type: 'pie',
              name: 'Progress',
              data: [
                {
                  name: totalSchools,
                  y: parseInt(this.activeSchool()),
                  color: '#4caf50',
                },
                {
                  name: activeSchools,
                  y:
                    parseInt(this.totalSchools()) -
                    parseInt(this.activeSchool()),
                  color: '#e0e0e0',
                },
              ],
            },
          ],
          tooltip: {
            pointFormat: '<b>{point.y}</b> ({point.percentage:.1f}%)',
            positioner: (labelWidth, labelHeight, point) => ({
              // x: point.plotX + labelWidth / 2,
              // y: point.y ?? 0 < 0 ? point.plotY - (point.y ?? 0) : point.plotY,
              x: 0,
              y: 0,
            }),
          },
        },
      };
    };
    createChart();
    //createChart('Total Schools', 'Active Schools');
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
  private parseTotalAndActiveSchoolsGraph() {
    const totalSchools$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.TOTAL_SCHOOLS) as HTMLInputElement)
    );
    const activeSchools$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.ACTIVE_SCHOOLS) as HTMLInputElement)
    );
    let title$ = this.tr.get('dashboardPage.labels.totalSchools');
    let active$ = this.tr.get('dashboardPage.labels.activeSchools');
    let merged = zip(totalSchools$, activeSchools$, title$, active$);
    merged.pipe(this.unsubscribe.takeUntilDestroy).subscribe({
      next: (results) => {
        let [totalInput, activeInput, totalText, activeText] = results;
        this.totalSchools.set(totalInput.value);
        this.activeSchool.set(activeInput.value);
        this.initActiveSchoolsChart(totalText, activeText);
      },
      error: (err) => console.error(err),
    });
  }
  private parseBillsIssued() {
    const billsIssued$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.BILLS_ISSUED) as HTMLInputElement)
    );
    billsIssued$.subscribe({
      next: (htmlInput) => this.billsIssued.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseStudents() {
    const students$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.STUDENTS) as HTMLInputElement)
    );
    students$.subscribe({
      next: (htmlInput) => this.students.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseUsers() {
    const users$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.USERS) as HTMLInputElement)
    );
    users$.subscribe({
      next: (htmlInput) => this.users.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseBankUsers() {
    const bankUsers$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.BANK_USERS) as HTMLInputElement)
    );
    bankUsers$.subscribe({
      next: (htmlInput) => this.bankUsers.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseSchoolUsers() {
    const schoolUsers$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.SCHOOL_USERS) as HTMLInputElement)
    );
    schoolUsers$.subscribe({
      next: (htmlInput) => this.schoolUsers.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseCollectedAmount() {
    const collectedAmount$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(DashboardForm.COLLECTED_AMOUNT) as HTMLInputElement)
    );
    collectedAmount$.subscribe({
      next: (htmlInput) => this.collectedAmount.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  ngAfterViewInit(): void {
    this.initIds();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['keys']) {
      this.initIds();
    }
  }
  initIds() {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(DashboardForm).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
    this.ids$ && this.attachEventHandlers();
  }
  attachEventHandlers() {
    this.parseTotalAndActiveSchoolsGraph();
    this.parseBillsIssued();
    this.parseStudents();
    this.parseUsers();
    this.parseBankUsers();
    this.parseSchoolUsers();
    this.parseCollectedAmount();
  }
}
