import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mode } from '../../model/mode';
import { User } from '../../model/user';
import { SignalRService } from '../../services/signalr.service';
import { Player } from 'src/app/model/player';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: []
})
export class RankingComponent {
  questionNumber: number = 0;
  mode: number = 1;
  ranking: Player[] = [];
  quizLength: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private restservice: RestService) { 
    this.getParams();
    this.restservice.getRanking(1, this.questionNumber).subscribe((data) => {
      this.ranking = data;
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.questionNumber = params['currentQuestionId'];
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      this.restservice.getQuizLengthById(1).subscribe((data) => {
        this.quizLength = data;
      });
    });
  }

  nextQuestion() {
    if (this.questionNumber == this.quizLength) {
      this.router.navigate(['/statistics']);
    }
    this.signalRService.connection.send("sendToNextQuestion");
    const queryParams = {
      currentQuestionId: ++this.questionNumber,
      mode: Mode.GAME_MODE
    };
    this.router.navigate(['/question'], { queryParams });
  }
}
