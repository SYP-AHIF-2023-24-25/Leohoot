import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive, ChartComponent } from 'ng-apexcharts';
import { Statistic } from 'src/app/model/statistic';
import { RestService } from 'src/app/services/rest.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { Chart} from "../../../model/chart";


@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls : [],
})
export class StatisticComponent {
  gameId!: number;
  statistic!: Statistic;

  constructor(private route: ActivatedRoute, private restservice: RestService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
        this.restservice.getGameStatistics(this.gameId).subscribe((data) => {
          console.log(data.questionAnswers, "data")
          this.statistic = data;
        });
        this.restservice.postStatistics(this.gameId).subscribe((data) => {})
      }
    });
  }

  public async navigateBack() {
    await this.router.navigate(['/dashboard']);
  }
}
