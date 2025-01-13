import { Component, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RestService } from "../../../services/rest.service";
import { StatisticDetails } from "../../../model/statistic-details";

@Component({
  selector: 'app-statistic-details',
  templateUrl: './statistic-details.component.html',
})
export class StatisticDetailsComponent {
  isSidebarVisible = false;
  screenIsLarge = false;
  statistic!: StatisticDetails;

  constructor(private route: ActivatedRoute, private restService: RestService) {
    this.screenIsLarge = window.innerWidth >= 1024;
    this.route.queryParams.subscribe(params => {
      let statisticId = parseInt(params['statisticId']);
      restService.getStatisticDetails(statisticId).subscribe((data) => {
        this.statistic = data;
        console.log(this.statistic);
      })
    })
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenIsLarge = window.innerWidth >= 1024;
  }
}
