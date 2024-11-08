import { Component, HostListener } from '@angular/core';
import {QuestionTeacher} from "../../../model/question-teacher";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import {SignalRService} from "../../../services/signalr.service";
import {Mode} from "../../../model/mode";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html'
})
export class QuestionPreviewComponent {
  gameId!: number;
  question!: QuestionTeacher;

  currTime: number = 0;
  obsTimer: Subscription = new Subscription();

  connectionSubscription: Subscription;
  gameCanceled: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
    this.connectionSubscription = this.signalRService.connectionClosed$.subscribe(async () =>
      {
        alert("Ending Game (No Players left)");
        await this.deleteGame();
      } );
  }

  async deleteGame() {
    this.connectionSubscription.unsubscribe();
    this.obsTimer.unsubscribe();

    if (this.gameCanceled) {
      await this.signalRService.connection.send("cancelGame", this.gameId);
      this.restservice.deleteGame(this.gameId).subscribe(async () => {
        await this.router.navigate(['/quizOverview']);
      });
    }
  }

  async ngOnDestroy() {
    await this.deleteGame();
  }

  ngOnInit() {
    this.getParams();
  }

  @HostListener('window:beforeunload', ['$event'])
  async handleBeforeUnload(event: Event) {
    await this.deleteGame();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      this.restservice.getQuestionTeacher(this.gameId).subscribe((data) => {
        this.question = data;
        this.startTimer();
      } );
    });
  }
  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe(async (currTime) => {
      if (
        currTime == this.question.previewTime
      ) {
        this.gameCanceled = false;
        this.obsTimer.unsubscribe();
        await this.signalRService.connection.send("finishPreview", this.gameId);
        await this.router.navigate(['/question'], { queryParams: { gameId: this.gameId, mode: Mode.GAME_MODE }});
      }
      this.currTime = currTime;
    });
  }
}
