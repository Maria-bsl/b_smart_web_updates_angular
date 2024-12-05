import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { firstValueFrom, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HighchartsChartModule } from 'highcharts-angular';
// import Highcharts from 'highcharts';
import * as Highcharts from 'highcharts';

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
  customChartType!: CustomChartType;
  blockedUsers$ = of([
    'Amaye Kadima',
    'Yannick Bolasie',
    'Tshikeva Bakambu',
    'Shetani Kasura Mungu',
  ]);
  constructor(
    private tr: TranslateService,
    private appConfig: AppConfigService
  ) {
    this.tr.use('en');
    this.registerIcons();
    this.initChart();
  }
  private async initChart() {
    this.customChartType = {
      updateFromInput: true,
      Highcharts: Highcharts,
      chartOptions: {
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
