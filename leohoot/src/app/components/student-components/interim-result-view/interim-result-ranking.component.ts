import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import { SignalRService } from '../../../services/signalr.service';
import { QuestionTeacher } from 'src/app/model/question-teacher';
import { QuestionStudent } from 'src/app/model/question-student';

@Component({
  selector: 'app-students-mobile-ranking',
  templateUrl: './interim-result-ranking.component.html',
  styleUrls: []
})
export class InterimResultRankingComponent {
  gameId!: number;
  username: string = sessionStorage.getItem("username") || "test";
  question!: QuestionStudent;


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

    this.signalRService.connection.on("nextQuestion", (gameId: number) => {
      console.log("nextQuestion");
      if (gameId == this.gameId)
      {
        const queryParams = {
          gameId: this.gameId
        };
        this.router.navigate(['/answerView'], { queryParams });
      }
    });

    this.signalRService.connection.on("gameEnded", (gameId: number) => {
      if (gameId == this.gameId) {
        alert("Game was canceled by the teacher");
        this.router.navigate(['/gameLogin'], { queryParams: { gameId: this.gameId } });
      }
    });

    this.restservice.getQuestionStudent(this.gameId, this.username).subscribe((data) => {
      this.question = data;
   } );
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
    });
  }
}
