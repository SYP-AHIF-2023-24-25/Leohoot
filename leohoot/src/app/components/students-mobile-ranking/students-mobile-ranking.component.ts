import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../services/rest.service";
import { SignalRService } from '../../services/signalr.service';
import { Question } from 'src/app/model/question';

@Component({
  selector: 'app-students-mobile-ranking',
  templateUrl: './students-mobile-ranking.component.html',
  styleUrls: []
})
export class StudentsMobileRankingComponent {
  quizLength: number = 0;
  questionNumber: number = 0;
  username: string = sessionStorage.getItem("username") || "test";
  points: number = 0;
  currentPoints: number = 0;
  question!: Question;
  

  trueOrFalse = [
    'assets/images/true.png',
    'assets/images/false.png'
  ]

  isRightAnswer(currentPoints: number) {
    if(currentPoints > 0) {
      return this.trueOrFalse.at(0);
    }
    return this.trueOrFalse.at(1);
  }

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit() {
    this.getParams();

    this.signalRService.connection.on("nextQuestion", () => {
      const queryParams = {
        currentQuestionId: this.questionNumber + 1 
      };
      this.router.navigate(['/studentMobileView'], { queryParams });
    });
    this.restservice.getQuestionByQuestionNumber(1, this.questionNumber, this.username).subscribe((data) => {
      this.question = data.question;
      this.points = data.points;
      this.quizLength = data.quizLength;
      this.currentPoints = data.currentPoints;
   } );
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.questionNumber = parseInt(params['currentQuestionId']);
      }
    });
  }
}
