import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mode } from '../../../model/mode';
import { User } from '../../../model/user';
import { SignalRService } from '../../../services/signalr.service';
import { Ranking } from '../../../model/ranking';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: []
})
export class RankingComponent {
  gameId!: number;
  mode: number = 1;
  ranking!: Ranking;
  questionTimeout: any;
  connectionSubscription: Subscription;
  gameCanceled: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private restservice: RestService) {
    this.getParams();

    this.questionTimeout = setTimeout(() => {
      alert("Question timeout! Ending this game.");
      this.deleteGame();
    }, 10 * 60 * 60 * 1000);

    this.connectionSubscription = this.signalRService.connectionClosed$.subscribe(() =>
    {
      alert("Delete Game (Connection Closed)");
      this.deleteGame();
    } );
  }

  deleteGame() {
    clearTimeout(this.questionTimeout);
    this.connectionSubscription.unsubscribe();

    if (this.gameCanceled) {
      this.signalRService.connection.send("gameEnded", this.gameId);

      this.restservice.deleteGame(this.gameId).subscribe(() => {
        this.router.navigate(['/quizOverview']);
      });
    }
  }

  ngOnDestroy(): void {
    this.deleteGame();
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
    this.gameCanceled = false;
    this.restservice.nextQuestion(this.gameId).subscribe(() =>
    {
      const queryParams = {
        gameId: this.gameId,
        mode: Mode.GAME_MODE
      };
      this.router.navigate(['/questionPreview'], { queryParams });
    });
  }
}
