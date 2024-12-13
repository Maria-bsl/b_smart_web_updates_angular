import {
  AfterViewInit,
  Component,
  Input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
// import Highcharts from 'highcharts';
import * as Highcharts from 'highcharts';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { DashboardForm } from 'src/app/core/enums/admin/dashboard.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';

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
})
export class DashboardPageComponent implements AfterViewInit {
  totalSchools = signal<string>('');
  activeSchool = signal<string>('');
  billsIssued = signal<string>('');
  students = signal<string>('');
  users = signal<string>('');
  bankUsers = signal<string>('');
  schoolUsers = signal<string>('');
  collectedAmount = signal<string>('');
  //('blocked') blocked= signal<string>('');
  @Input('keys') keys: string = '';
  activeSchoolsChart!: CustomChartType;
  customChartType!: CustomChartType;
  blockedUsers$!: Observable<string[]>;
  currentIndex = signal<number>(0);
  timePeriodIndexes$ = of([0, 3, 6]);
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService,
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService
  ) {
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
  private parseTotalSchools() {
    const totalSchools$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.TOTAL_SCHOOLS) as HTMLInputElement)
    );
    totalSchools$.subscribe({
      next: (htmlInput) => this.totalSchools.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseActiveSchools() {
    const activeSchools$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.ACTIVE_SCHOOLS) as HTMLInputElement)
    );
    activeSchools$.subscribe({
      next: (htmlInput) => this.activeSchool.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseBillsIssued() {
    const billsIssued$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.BILLS_ISSUED) as HTMLInputElement)
    );
    billsIssued$.subscribe({
      next: (htmlInput) => this.billsIssued.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseStudents() {
    const students$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.STUDENTS) as HTMLInputElement)
    );
    students$.subscribe({
      next: (htmlInput) => this.students.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseUsers() {
    const users$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.USERS) as HTMLInputElement)
    );
    users$.subscribe({
      next: (htmlInput) => this.users.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseBankUsers() {
    const bankUsers$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.BANK_USERS) as HTMLInputElement)
    );
    bankUsers$.subscribe({
      next: (htmlInput) => this.bankUsers.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseSchoolUsers() {
    const schoolUsers$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.SCHOOL_UERS) as HTMLInputElement)
    );
    schoolUsers$.subscribe({
      next: (htmlInput) => this.schoolUsers.set(htmlInput.value),
      error: (err) => console.error(err.message),
    });
  }
  private parseCollectedAmount() {
    const collectedAmount$ = this.domService.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((el) => el.get(DashboardForm.COLLECTED_AMOUNT) as HTMLInputElement)
    );
    collectedAmount$.subscribe({
      next: (htmlInput) => this.collectedAmount.set(htmlInput.value),
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
  ngAfterViewInit(): void {
    this.domService.parseDocumentKeys(
      this.keys,
      Object.keys(DashboardForm).filter((key) => isNaN(Number(key))).length
    );
    this.attachEventHandlers();
  }
}
