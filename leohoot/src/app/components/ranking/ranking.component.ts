import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mode } from '../../model/mode';
import { User } from '../../model/user';
import { SignalRService } from '../../services/signalr.service';
import { Player } from 'src/app/model/player';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: []
})
export class RankingComponent {
  currentQuestionId: number = 0;
  mode: number = 1;
  ranking: Player[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private signalRService: SignalRService) { 
    this.getParams();
    this.signalRService.connection.send("sendRanking");
    this.signalRService.connection.on("rankingReceived", (ranking) => {
      this.ranking = ranking as Player[];
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.currentQuestionId = params['currentQuestionId'];
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
    });
  }

  nextQuestion() {
    this.signalRService.connection.send("sendToNextQuestion");
    const queryParams = {
      currentQuestionId: this.currentQuestionId,
      mode: Mode.GAME_MODE
    };
    this.router.navigate(['/question'], { queryParams });
  }
}
