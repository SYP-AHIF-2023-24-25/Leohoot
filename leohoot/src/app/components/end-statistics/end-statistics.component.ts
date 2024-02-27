import { Component, ViewChild, ChangeDetectionStrategy  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Statistic } from 'src/app/model/statistic';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { ApexFill, ApexTheme, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  colors: any;
  labels: any;
};

@Component({
  selector: 'app-end-statistics',
  templateUrl: './end-statistics.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndStatisticsComponent {
  gameId!: number;
  statistic!: Statistic;

  displayStatistics: boolean = false;

  resultInPercentage!: string;
  correctAnswers!: number;
  totalAnswers!: number;
  incorrectAnswers!: number;
  correctAnswersInPercentage!: number;
  incorrectAnswersInPercentage!: number;

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      this.restservice.getGameStatistics(this.gameId).subscribe((data) => {
        this.statistic = data;
        console.log(this.statistic);
      });
    });
    this.initChart();
  }

  initChart() {
    this.correctAnswersInPercentage = 0;
    this.incorrectAnswersInPercentage = 0;
    this.chartOptions = {
      series: [this.correctAnswersInPercentage, this.incorrectAnswersInPercentage],
      chart: {
        type: "donut"
      },
      colors: ["#8AE67C", "#FF6F61",],
      labels: ["correct", "incorrect"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  showStatistics() {
    this.displayStatistics = !this.displayStatistics;
  }

  calculateResults(questionNumber: number) {
    if (!this.statistic.questionAnswers.get(questionNumber)) {
       this.resultInPercentage = "0 %";
       this.totalAnswers = 0;
    } else {
      this.totalAnswers = this.statistic.questionAnswers.get(questionNumber)!.length;
      this.correctAnswers = this.statistic.questionAnswers.get(questionNumber)!.filter((answer) => answer === true).length;
      this.incorrectAnswers = this.statistic.questionAnswers.get(questionNumber)!.filter((answer) => answer === false).length;
      this.correctAnswersInPercentage = this.correctAnswers / this.totalAnswers * 100;
      this.incorrectAnswersInPercentage = this.incorrectAnswers / this.totalAnswers * 100;
      

      if (this.totalAnswers > 0) {
        this.resultInPercentage = (this.correctAnswers / this.totalAnswers * 100).toFixed(2) + " %";
      } else {
        this.resultInPercentage = "0 %";
      }
    }

    this.chartOptions.series = [this.correctAnswersInPercentage, this.incorrectAnswersInPercentage];
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
