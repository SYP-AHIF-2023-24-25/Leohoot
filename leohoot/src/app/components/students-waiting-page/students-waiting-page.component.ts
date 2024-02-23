import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-student-waiting-page',
  templateUrl: './students-waiting-page.component.html',
})
export class StudentWaitingPageComponent {
  gameId!: number;
  points: number = 0;
  username: string = sessionStorage.getItem("username") || "test";

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.signalRService.connection.on("startedGame", (gameId: number) => {
      this.route.queryParams.subscribe(params => {
        if (typeof params['gameId'] !== 'undefined') {
          this.gameId = parseInt(params['gameId']);
          this.router.navigate(['/studentMobileView'], { queryParams: { gameId: this.gameId }});
        }
      });
    });
  }
}
