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
  selector: 'app-statistic-table',
  templateUrl: './statistic-table.component.html',
})
export class StatisticTableComponent {
  @Input() statistic!: Statistic;
  @Input() gameId!: number;

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  displayStatistics: boolean = true;
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
      series: [0, 0, 0],
      chart: {
        type: "donut"
      },
      colors: ["#8AE67C", "#FF6F61", "#9ca3af"],
      labels: ["correct", "incorrect", "not given"],
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
      console.log(this.statistic.questionTexts[questionNumber], "Question");
      let chart: Chart = {
        questionNumber: questionNumber,
        questionText: this.statistic.questionTexts[questionNumber - 1],
        totalAnswers: this.statistic.playerCount,
        correctAnswers: 0,
        notGivenAnswers: this.statistic.playerCount,
        incorrectAnswers: 0,
        correctAnswersInPercentage: 0,
        notGivenAnswersInPercentage: 100,
        incorrectAnswersInPercentage: 0,
      };

      if (this.statistic.questionAnswers[questionNumber]) {
        chart.correctAnswers = this.statistic.questionAnswers[questionNumber].filter((answer) => answer).length;
        chart.incorrectAnswers = this.statistic.questionAnswers[questionNumber].filter((answer) => !answer).length;
        chart.notGivenAnswers = chart.totalAnswers - chart.incorrectAnswers - chart.correctAnswers;
        chart.correctAnswersInPercentage = chart.correctAnswers / chart.totalAnswers * 100;
        chart.incorrectAnswersInPercentage = chart.incorrectAnswers / chart.totalAnswers * 100;
        chart.notGivenAnswersInPercentage = chart.notGivenAnswers / chart.totalAnswers * 100;
      }

      this.charts.push(chart);
    }
    console.log(this.charts);
  }
}
