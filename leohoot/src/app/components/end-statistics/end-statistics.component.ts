import { Component, ViewChild, ChangeDetectionStrategy  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Player } from 'src/app/model/player';
import { Question } from 'src/app/model/question';
import { Quiz } from 'src/app/model/quiz';
import { Statistic } from 'src/app/model/statistic';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { ApexFill, ApexTheme, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { IncomingMessage } from 'http';

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
  
  ngOnInit(): void {
    this.restservice.getGameStatistics(1).subscribe((data) => {
      this.statistic = data;
    });

    /*this.restservice.getRanking(1, this.questions.length).subscribe((data) => {
      if (data === undefined) {
        this.topThreePlayers = [ {username: "No players yet", score: 0} ];
      } else {
        if (data.length > 3) {
          this.topThreePlayers = data.slice(0, 3);
        } else {
          while (data.length < 3) {
            data.push({ username: "", score: 0 });
          }
          
          this.topThreePlayers = data;
        }
      }      
    });*/
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
