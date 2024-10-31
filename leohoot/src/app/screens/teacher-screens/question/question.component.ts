import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Mode } from '../../../model/mode';
import { QuestionTeacher } from '../../../model/question-teacher';
import { RestService } from '../../../services/rest.service';
import { SignalRService } from '../../../services/signalr.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: []
})
export class QuestionComponent {
  mode: Mode = Mode.TEACHER_DEMO_MODE;
  currTime: number = 0;
  obsTimer: Subscription = new Subscription();
  questionIsFinished: boolean = false;
  audio = new Audio('assets/audio/quiz-background-sound.mp3');
  currentQuestion!: QuestionTeacher;
  answerCount: number = 0;
  correctAnswersCount: number = 0;
  gameId: number = 0;
  quizId: number = -1;
  questionTimeout: any;
  connectionSubscription: Subscription;
  gameCanceled: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
      this.questionTimeout = setTimeout(async () => {
        alert("Question timeout! Ending this game.");
        await this.deleteGame();
      }, 10 * 60 * 60 * 1000);

      this.connectionSubscription = this.signalRService.connectionClosed$.subscribe(async () =>
      {
        alert("Ending Game (No Players left)");
        await this.deleteGame();
      });
  }

  ngOnInit(): void {
    this.getParams();
    this.audio.loop = true;

    this.signalRService.connection.on("updateAnswerCount", async (answerCount: number, isFinished: boolean) => {
      if (isFinished)
      {
        await this.showCorrectAnswer();
      }
      this.answerCount = answerCount;
    });
  }

  async deleteGame() {
    clearTimeout(this.questionTimeout);
    this.connectionSubscription.unsubscribe();
    this.obsTimer.unsubscribe();

    if (this.gameCanceled) {
      await this.signalRService.connection.send("cancelGame", this.gameId);

      this.restservice.deleteGame(this.gameId).subscribe(() => {
        this.router.navigate(['/quizOverview']);
      });
    }
  }

  ngOnDestroy(): void {
    this.deleteGame().then();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: Event) {
    this.deleteGame().then();
  }


  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }

      if (typeof params['quizId'] !== 'undefined') {
        this.quizId = params['quizId'];
      }

      this.restservice.getQuestionTeacher(this.gameId).subscribe(response => {
        this.currentQuestion = response;
        this.correctAnswersCount = this.currentQuestion.answers.filter(answer => answer.isCorrect).length;
        this.startTimer();
      });
    });
  }

  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe(async (currTime) => {
      await this.audio.play();
      if (
        currTime == this.currentQuestion.answerTimeInSeconds
      ) {
        await this.showCorrectAnswer();
      }
      this.currTime = currTime;
    });
  }

  async showCorrectAnswer() {
    await this.signalRService.connection.send("questionFinished", this.gameId);
    this.questionIsFinished = true;
    this.obsTimer.unsubscribe();
    this.audio.pause();
  }

  async nextQuestion() {
    this.gameCanceled = false;

    if (this.currentQuestion.questionNumber === this.currentQuestion.quizLength && this.mode == Mode.GAME_MODE) {
      await this.router.navigate(['/statistic'], { queryParams: { gameId: this.gameId } });
    } else if (this.mode == Mode.GAME_MODE) {
      await this.router.navigate(['/ranking'], { queryParams: { gameId: this.gameId, mode: Mode.GAME_MODE } });
    } else {
      if (this.currentQuestion.questionNumber === this.currentQuestion.quizLength) {
        if (this.quizId !== -1) {
          this.restservice.deleteGame(this.gameId).subscribe(() => {
            this.router.navigate(['/quizMaker'], { queryParams: { quizId: this.quizId, mode: Mode.TEACHER_DEMO_MODE } });
          });
        }
      } else {
        this.restservice.nextQuestion(this.gameId).subscribe(() => {
          window.location.reload();
        });
      }
    }
  }
}
