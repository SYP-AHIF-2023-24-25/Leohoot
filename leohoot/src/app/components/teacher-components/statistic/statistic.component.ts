import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { Statistic } from 'src/app/model/statistic';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Chart} from "../../../model/chart";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  colors: any;
  labels: any;
};

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls : [],
})
export class StatisticComponent {
  gameId!: number;
  statistic!: Statistic;
  charts: Chart[] = [];

  displayStatistics: boolean = false;

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit(): void {
    this.initChart();
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      this.restservice.getGameStatistics(this.gameId).subscribe((data) => {
        this.statistic = data;
        console.log(this.statistic);
        this.calculateResults();
      });
    });
  }

  initChart() {
    this.chartOptions = {
      series: [0, 0],
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

  calculateResults() {
    for (let questionNumber = 1; questionNumber <= this.statistic.questionTexts.length; questionNumber++) {
      let chart: Chart = {
        questionNumber: questionNumber,
        questionText: this.truncateText(this.statistic.questionTexts[questionNumber - 1].questionText, 20),
        totalAnswers: this.statistic.playerCount,
        correctAnswers: 0,
        incorrectAnswers: 3,
        correctAnswersInPercentage: 0,
        incorrectAnswersInPercentage: 100
      };

      if (this.statistic.questionAnswers[questionNumber]) {
        chart.correctAnswers = this.statistic.questionAnswers[questionNumber].filter((answer) => answer === true).length;
        chart.incorrectAnswers = chart.totalAnswers - chart.correctAnswers;
        chart.correctAnswersInPercentage = chart.correctAnswers / chart.totalAnswers * 100;
        chart.incorrectAnswersInPercentage = chart.incorrectAnswers / chart.totalAnswers * 100;
      }

      this.charts.push(chart);
    }
    console.log(this.charts);
  }

  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
