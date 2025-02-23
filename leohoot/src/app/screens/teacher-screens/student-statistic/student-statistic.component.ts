import { Component, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RestService } from "../../../services/rest.service";
import { StatisticDetails, StatisticQuestion, StatisticUser } from "../../../model/statistic-details";

@Component({
  selector: 'app-statistic-details',
  templateUrl: './student-statistic.component.html',
})
export class StudentStatisticComponent {
  isSidebarVisible = false;
  screenIsLarge = false;
  statistic!: StatisticDetails;
  statisticId: number = 0;


  constructor(private route: ActivatedRoute, private restService: RestService) {
    this.screenIsLarge = window.innerWidth >= 1024;
    this.route.queryParams.subscribe(params => {
      let statisticId = parseInt(params['statisticId']);
      restService.getStatisticDetails(statisticId).subscribe((data) => {
        this.statistic = data;
        this.statisticId = statisticId;
        console.log(this.statistic);
      })
    })
  }

  colors = [
    'bg-button-yellow',
    'bg-green-400',
    'bg-rose-400',
    'bg-blue-400',
  ];

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  toggleOnOpen(user: StatisticUser){
    user.isOpen = !user.isOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenIsLarge = window.innerWidth >= 1024;
  }

  downloadStatistics() {
    console.log("downloadStatistics");
    this.restService.getStatisticCsv(this.statisticId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'statistics.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
  }
}
