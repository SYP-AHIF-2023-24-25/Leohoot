import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { StatisticOverview } from "../../../model/statistic-overview";
import { RestService } from "../../../services/rest.service";

@Component({
  selector: 'app-game-statistics',
  templateUrl: './game-statistics.component.html',
})
export class GameStatisticsComponent {
  isSidebarVisible = false;
  screenIsLarge = false;
  statistics: StatisticOverview[] = [];

  constructor(private router: Router, private restService: RestService) {
    this.restService.getStatisticsForOverview().subscribe((data) => {
      this.statistics = data;
      console.log(this.statistics)
    })
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenIsLarge = window.innerWidth >= 1024;
  }

  async navigateToDetails(statisticId:number) {
    console.log(statisticId);
    await this.router.navigate(['/statisticDetails'], {queryParams: {statisticId: statisticId}});
  }

  downloadCsv(statisticId: number): void {
    this.restService.getStatisticDetails(statisticId).subscribe((data) => {
      let headers = 'Question';
      let rows: string[] = [];
    })

  }
}
