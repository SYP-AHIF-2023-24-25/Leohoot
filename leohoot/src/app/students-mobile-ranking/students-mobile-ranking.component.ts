import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../services/rest.service";
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-students-mobile-ranking',
  templateUrl: './students-mobile-ranking.component.html',
  styleUrls: []
})
export class StudentsMobileRankingComponent {
  quizLength = this.restservice.getQuizLength();
  currentQuestionId: number = 0;
  username: string = "Sophie";
  points: number = 0;
  currentPoints: number = 0;
  

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit() {
    this.getParams();

    this.signalRService.connection.send("sendPoints", this.username);
    this.signalRService.connection.on("pointsReceived", (points: number, currentPoints: number) => {
      this.points = points;
      this.currentPoints = currentPoints;
    });

    this.signalRService.connection.on("nextQuestion", () => {
      const queryParams = {
        currentQuestionId: this.restservice.getNextQuestionId(this.currentQuestionId)
      };
      this.router.navigate(['/studentMobileView'], { queryParams });
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.currentQuestionId = parseInt(params['currentQuestionId']);
      }
    });
  }
}
