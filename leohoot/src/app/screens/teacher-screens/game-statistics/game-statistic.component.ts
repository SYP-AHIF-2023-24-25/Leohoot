import { Component, HostListener } from "@angular/core";
import { Statistic } from "../../../model/statistic";
import { RestService } from "../../../services/rest.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-game-statistics',
  templateUrl: './game-statistic.component.html',
})
export class GameStatisticComponent {
  isSidebarVisible = false;
  screenIsLarge = false;
  statistic?: Statistic;

  constructor(private restService: RestService, private route: ActivatedRoute) {
    this.screenIsLarge = window.innerWidth >= 1024;
    this.route.queryParams.subscribe(params => {
      let statisticId = parseInt(params['statisticId']);
      this.restService.getGameStatistics(statisticId).subscribe((data) => {
        this.statistic = data;
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
