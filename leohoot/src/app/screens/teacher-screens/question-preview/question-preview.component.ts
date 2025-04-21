import { Component, HostListener } from '@angular/core';
import { QuestionTeacher } from '../../../model/question-teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';
import { Mode } from '../../../model/mode';
import { Subscription, timer } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
})
export class QuestionPreviewComponent {
  gameId!: number;
  question!: QuestionTeacher;
  mode!: Mode;
  quizId!: number;

  currTime: number = 0;
  obsTimer: Subscription = new Subscription();

  connectionSubscription: Subscription;
  gameCanceled: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restservice: RestService,
    private signalRService: SignalRService,
    private alertService: AlertService
  ) {
    this.connectionSubscription =
      this.signalRService.connectionClosed$.subscribe(async () => {
        this.alertService.show('info', 'Ending Game, no players left.');
        await this.deleteGame();
      });
  }

  async deleteGame() {
    this.connectionSubscription.unsubscribe();
    this.obsTimer.unsubscribe();

    if (this.gameCanceled) {
      await this.signalRService.connection.send('cancelGame', this.gameId);
      this.restservice.deleteGame(this.gameId).subscribe(async () => {
        await this.router.navigate(['/dashboard']);
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
    this.route.queryParams.subscribe((params) => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = parseInt(params['mode']);
      }
      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = parseInt(params['quizId']);
      }
      this.restservice.getQuestionTeacher(this.gameId).subscribe((data) => {
        this.question = data;
        this.startTimer();
      });
    });
  }
  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe(async (currTime) => {
      if (currTime == this.question.previewTime) {
        this.gameCanceled = false;
        this.obsTimer.unsubscribe();
        await this.signalRService.connection.send('finishPreview', this.gameId);
        console.log(this.mode, Mode.TEACHER_DEMO_MODE);
        if (this.mode === Mode.TEACHER_DEMO_MODE) {
          await this.router.navigate(['/question'], { queryParams: { gameId: this.gameId , mode: Mode.TEACHER_DEMO_MODE, quizId: this.quizId} });
        } else {
          await this.router.navigate(['/question'], { queryParams: { gameId: this.gameId, mode: Mode.GAME_MODE }, });
        }
      }
      this.currTime = currTime;
    });
  }
}
