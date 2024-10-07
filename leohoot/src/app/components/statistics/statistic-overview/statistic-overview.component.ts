import { Component, Input, ViewChild } from "@angular/core";
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from "ng-apexcharts";
import { Statistic } from "../../../model/statistic";
import { Chart } from "../../../model/chart";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  colors: any;
  labels: any;
};

@Component({
  selector: 'app-statistic-overview',
  templateUrl: './statistic-overview.component.html',
})
export class StatisticOverviewComponent {
  @Input() statistic!: Statistic;
  @Input() gameId!: number;

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  displayStatistics: boolean = false;
  charts: Chart[] = [];

  ngOnInit(): void {
    this.initChart();
    this.calculateResults();
  }
  showStatistics() {
    this.displayStatistics = !this.displayStatistics;
  }
  truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
}
