import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mode } from '../../model/mode';
import { User } from '../../model/user';
import { SignalRService } from '../../services/signalr.service';
import { Ranking } from '../../model/ranking';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: []
})
export class RankingComponent {
  gameId!: number;
  mode: number = 1;
  ranking!: Ranking;

  constructor(private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private restservice: RestService) {
    this.getParams();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = params['gameId'];
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      this.restservice.getRanking(this.gameId).subscribe((data) => {
        this.ranking = data;
      });
    });
  }

  nextQuestion() {
    this.restservice.nextQuestion(this.gameId).subscribe(() => 
    {
      const queryParams = {
        gameId: this.gameId,
        mode: Mode.GAME_MODE
      };
      this.router.navigate(['/preview'], { queryParams });
    });
  }
}
