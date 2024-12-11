import { Component, Input, signal, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { firstValueFrom, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
// import Highcharts from 'highcharts';
import * as Highcharts from 'highcharts';
import { ElementDomManipulationService } from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';

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
export class DashboardPageComponent {
  @Input('total-schools') totalSchools: string = '0';
  @Input('active-schools') activeSchool: string = '0';
  @Input('bills-issued') billsIssued: string = '0';
  @Input('students') students: string = '0';
  @Input('users') users: string = '0';
  @Input('blocked-users') blockedUsers: string = 'Bokutani';
  activeSchoolsChart!: CustomChartType;
  customChartType!: CustomChartType;
  blockedUsers$!: Observable<string[]>;
  currentIndex = signal<number>(0);
  timePeriodIndexes$ = of([0, 3, 6]);
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService,
    private domService: ElementDomManipulationService
  ) {
    this.tr.use('en');
    this.registerIcons();
    this.initChart();
    this.initActiveSchoolsChart();
    let arr = this.domService.getCommaSeperatedValuesFromString(
      this.blockedUsers
    );
    this.blockedUsers$ = of(arr);
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
}
