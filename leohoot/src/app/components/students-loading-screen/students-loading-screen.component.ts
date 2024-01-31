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
  questionNumber: number = 0;
  quizLength?: number;
  points: number = 0;
  username: string = sessionStorage.getItem("username") || "test";

    constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
      this.getParams();
      this.signalRService.connection.on("endLoading", () => {
        const queryParams = {
          currentQuestionId: this.questionNumber
        };
        this.router.navigate(['/studentMobileRanking'], { queryParams });
      });
    }

    getParams() {
      this.route.queryParams.subscribe(params => {
        if (typeof params['currentQuestionId'] !== 'undefined') {
          this.questionNumber = parseInt(params['currentQuestionId']);
          this.restservice.getQuestionByQuestionNumber(1, this.questionNumber, this.username).subscribe((data) => {
            this.points = data.points;
            this.quizLength = data.question.quizLength;
            this.points = data.currentPoints;
         } );
        }
      });
    }
}
