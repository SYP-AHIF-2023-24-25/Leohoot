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
  filteredStatistics: StatisticOverview[] = [];

  constructor(private router: Router, private restService: RestService) {
    this.restService.getStatisticsForOverview().subscribe((data) => {
      this.statistics = data.map(s => {
        s.startTime = new Date(s.startTime)
        s.endTime = new Date(s.endTime)
        return {...s}
      });
      this.filteredStatistics = this.statistics;
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

  async onFilterChanged(quizName: string, startDate: string | null, endDate: string | null) {
    const startDateDate = startDate ? new Date(startDate) : null;
    const endDateDate = endDate ? new Date(endDate) : null;
    this.filteredStatistics = this.statistics
      .filter(s => {
        return (quizName.length === 0 || s.quizName.toLowerCase().includes(quizName.toLowerCase()))
            && (startDate === null || startDateDate! < s.startTime)
            && (endDate === null || endDateDate! > s.endTime)
      })
    console.log(this.filteredStatistics)
  }

  getDateString(date: Date) {
    return `${date.getDate().toString().padStart(2,'0')}.${(date.getMonth() + 1).toString().padStart(2,'0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
  }
}
