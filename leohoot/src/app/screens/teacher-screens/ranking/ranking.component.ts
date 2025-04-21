import { Component, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mode } from '../../../model/mode';
import { User } from '../../../model/user';
import { SignalRService } from '../../../services/signalr.service';
import { Ranking } from '../../../model/ranking';
import { RestService } from 'src/app/services/rest.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

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

  constructor(private router: Router, private route: ActivatedRoute, private signalRService: SignalRService, private restservice: RestService, private alertService: AlertService) {
    this.getParams();

    this.questionTimeout = setTimeout(() => {
      this.alertService.show('info', "Question timeout! Ending this game.");
      this.deleteGame();
    }, 10 * 60 * 60 * 1000);

    this.connectionSubscription = this.signalRService.connectionClosed$.subscribe(() =>
    {
      this.alertService.show('info', "Ending Game, no players left.");
      this.deleteGame();
    } );
  }

  deleteGame() {
    clearTimeout(this.questionTimeout);
    this.connectionSubscription.unsubscribe();

    if (this.gameCanceled) {
      this.signalRService.connection.send("cancelGame", this.gameId);

      this.restservice.deleteGame(this.gameId).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

  ngOnDestroy(): void {
    this.deleteGame();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event) {
    this.deleteGame();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      this.restservice.getRanking(this.gameId).subscribe((data) => {
        this.ranking = data;
      });
    });
  }

  async nextQuestion() {
    this.gameCanceled = false;
   // await this.signalRService.connection.send("finishPreview", this.gameId);

    console.log(this.gameId, typeof this.gameId);
    await this.signalRService.connection.send("sendToNextQuestion", this.gameId);

    console.log("Next question");
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
