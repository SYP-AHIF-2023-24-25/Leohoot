import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Mode } from '../../model/mode';
import { Question } from '../../model/question';
import { RestService } from '../../services/rest.service';
import { SignalRService } from '../../services/signalr.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: []
})
export class QuestionComponent {
  colors = [
    'bg-button-yellow',
    'bg-green-400',
    'bg-rose-400',
    'bg-blue-400',
  ];

  icons = [
    'assets/images/cat.png',
    'assets/images/frog.png',
    'assets/images/crab.png',
    'assets/images/bird.png'
    ];

  currentQuestionId: number = 1;
  mode: Mode = Mode.TEACHER_DEMO_MODE;
  currTime: number = 0;
  obsTimer: Subscription = new Subscription();
  questionIsFinished: boolean = false;
  audio = new Audio('assets/audio/quiz-background-sound.mp3');
  currentQuestion!: Question;
  answerCount: number = 0;
  gameId: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
  }

  ngOnInit(): void {
    this.getParams();
    this.audio.loop = true;
    
    this.signalRService.connection.on("updateAnswerCount", (answerCount: number, isFinished: boolean) => {
      if (isFinished)
      {
        this.showCorrectAnswer();
      }
      this.answerCount = answerCount;
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['gameId'] !== 'undefined') {
        this.gameId = parseInt(params['gameId']);
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      
      this.restservice.getQuestionTeacher(this.gameId).subscribe(response => {
        this.currentQuestion = response;
        this.startTimer();
      });
    });
  }

  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe((currTime) => {
      this.audio.play();
      if (
        currTime == this.currentQuestion.answerTimeInSeconds
      ) {
        this.showCorrectAnswer();
      }
      this.currTime = currTime;
    });
  }

  showCorrectAnswer() {
    this.signalRService.connection.send("sendEndLoading", this.gameId);
    this.questionIsFinished = true;
    this.obsTimer.unsubscribe();
    this.audio.pause();
  }

  nextQuestion() {
    if (this.currentQuestion.questionNumber === this.currentQuestion.quizLength && this.mode == Mode.GAME_MODE) {
      this.router.navigate(['/statistics'], { queryParams: { gameId: this.gameId } });
    } else if (this.mode == Mode.GAME_MODE) {
      this.router.navigate(['/ranking'], { queryParams: { gameId: this.gameId, mode: Mode.GAME_MODE } });
    } else {
      if (this.currentQuestion.questionNumber === this.currentQuestion.quizLength) {
        this.restservice.deleteGame(this.gameId).subscribe(() => {
          this.router.navigate(['/designQuiz']);
        });
      } else {
        this.restservice.nextQuestion(this.gameId).subscribe(() => {
          window.location.reload();
        });
      }
    }
  }
}
