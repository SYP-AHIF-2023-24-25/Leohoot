import { Component } from '@angular/core';

@Component({
  selector: 'app-end-statistics',
  templateUrl: './end-statistics.component.html',
  styleUrls: []
})
export class EndStatisticsComponent {
  displayStatistics: boolean = false;

  showStatistics() {
    this.displayStatistics = !this.displayStatistics;
  }

}
