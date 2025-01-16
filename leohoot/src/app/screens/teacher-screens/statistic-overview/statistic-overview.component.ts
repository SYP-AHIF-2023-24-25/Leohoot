import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { StatisticOverview } from "../../../model/statistic-overview";
import { RestService } from "../../../services/rest.service";

@Component({
  selector: 'app-students-statistics',
  templateUrl: './statistic-overview.component.html',
})
export class StatisticOverviewComponent {
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

  async navigateToStudentStatistics(statisticId:number) {
    await this.router.navigate(['/studentStatistics'], {queryParams: {statisticId: statisticId}});
  }

  async navigateToGameStatistics(statisticId:number) {
    await this.router.navigate(['/gameStatistics'], {queryParams: {statisticId: statisticId}});
  }

  downloadCsv(statisticId: number): void {
    this.restService.getStatisticDetails(statisticId).subscribe((data) => {
      let headers = 'Question';
      let rows: string[] = [];
    })

  }
}
