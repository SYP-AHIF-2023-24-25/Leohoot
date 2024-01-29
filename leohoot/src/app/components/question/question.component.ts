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
  quizLength: number = 0;
  answerCount: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {
  }

  ngOnInit(): void {
    this.getParams();
    this.audio.loop = true;
    
    this.signalRService.connection.on("updateAnswerCount", (answerCount: number, playerCount: number) => {
      console.log(`AnswerCount: ${answerCount}, PlayerCount: ${playerCount}`);
      console.log(answerCount == playerCount);
      if (answerCount == playerCount)
      {
        this.obsTimer.unsubscribe();
        this.questionIsFinished = true;
        this.signalRService.connection.send("sendEndLoading");
        const queryParams = {
          currentQuestionId: this.currentQuestion.questionNumber,
          mode: Mode.GAME_MODE
        };
        this.router.navigate(['/ranking'], { queryParams });
      }
      this.answerCount = answerCount;
    });
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.currentQuestionId = parseInt(params['currentQuestionId']);
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      this.getQuestion();
      this.restservice.getQuizLengthById(1).subscribe((data) => {
        this.quizLength = data;
      });
    });
  }

  getQuestion() {
    this.restservice.getQuestionByIdAllInfo(1,this.currentQuestionId).subscribe(response => {
      this.currentQuestion = response;
      this.startTimer();
    });
  }

  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe((currTime) => {
      this.audio.play();
      if (
        currTime == this.currentQuestion.answerTimeInSeconds
      ) {
        this.obsTimer.unsubscribe();
        this.questionIsFinished = true;
        this.signalRService.connection.send("sendEndLoading");
        this.audio.pause();
      }
      this.currTime = currTime;
    });
  }

  showCorrectAnswer() {
    this.signalRService.connection.send("sendEndLoading");
    this.questionIsFinished = true;
    this.obsTimer.unsubscribe();
    this.audio.pause();
  }

  nextQuestion() {
    console.log(`QuestionNumber: ${this.currentQuestion.questionNumber}, QuizLength: ${this.quizLength}`);
    console.log(this.currentQuestion.questionNumber === this.quizLength);
    if (this.currentQuestion.questionNumber === this.quizLength && this.mode == Mode.GAME_MODE) {
      console.log("nextQuestion");
      this.router.navigate(['/statistics']);
    }

    if (this.mode == Mode.TEACHER_DEMO_MODE) {
      const queryParams = {
        currentQuestionId: ++this.currentQuestion.questionNumber,
        mode: Mode.TEACHER_DEMO_MODE
      };
      this.router.navigate(['/question'], { queryParams });
      this.questionIsFinished = false;

    } else if (this.mode == Mode.GAME_MODE) {
      const queryParams = {
        currentQuestionId: this.currentQuestion.questionNumber,
        mode: Mode.GAME_MODE
      };
      this.router.navigate(['/ranking'], { queryParams });
    }
  }
}
