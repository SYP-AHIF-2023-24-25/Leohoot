import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-students-loading-screen',
  templateUrl: './students-loading-screen.component.html',
  styleUrls: []
})
export class StudentsLoadingScreenComponent {
  currentQuestionId: number = 0;
  quizLength = this.restservice.getQuizLength();
  points: number = 0;
  username: string = sessionStorage.getItem("username") || "test";

    constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
      this.getParams();
      this.signalRService.connection.on("endLoading", () => {
        const queryParams = {
          currentQuestionId: this.currentQuestionId
        };
        this.router.navigate(['/studentMobileRanking'], { queryParams });
      });
    }

    getParams() {
      this.route.queryParams.subscribe(params => {
        if (typeof params['currentQuestionId'] !== 'undefined') {
          this.currentQuestionId = parseInt(params['currentQuestionId']);
        }
      });

      this.signalRService.connection.send("sendPoints", this.username);
      this.signalRService.connection.on("pointsReceived", (points: number, currentPoints: number) => {
        this.points = points;
      });
    }
}
