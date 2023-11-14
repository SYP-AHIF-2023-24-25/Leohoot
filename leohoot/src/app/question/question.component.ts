import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Mode } from 'src/model/mode';
import { Question } from 'src/model/question';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {
  @Input() currentQuestionId: number = 0;
  @Input() mode: number = 0;

  colors = [
    'bg-button-yellow',
    'bg-button-orange',
    'bg-button-purple',
    'bg-button-blue',
  ];
  currTime: number = 0;
  obsTimer: Subscription = new Subscription();
  questionIsFinished: boolean = false;
  audio = new Audio('assets/audio/quiz-background-sound.mp3');
  currentQuestion!: Question;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.currentQuestionId = params['currentQuestionId'];
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      const response: Question | undefined = this.restservice.getQuestionById(this.currentQuestionId);
      if (typeof response === 'undefined') {
        this.router.navigate(['/teacherDemoModeQuiz']);
      } else {
        this.currentQuestion = response;
      }
      this.audio.loop = true;
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
        this.audio.pause();
      }
      this.currTime = currTime;
    });
  }

  showCorrectAnswer() {
    this.questionIsFinished = true;
    this.obsTimer.unsubscribe();
    this.audio.pause();
  }

  nextQuestion() {
    if (this.mode == Mode.TEACHER_DEMO_MODE) {
      const queryParams = {
        currentQuestionId: ++this.currentQuestionId,
        mode: Mode.TEACHER_DEMO_MODE
      };
      this.router.navigate(['/question'], { queryParams });
      this.questionIsFinished = false;
    } else if (this.mode == Mode.GAME_MODE) {
      const queryParams = {
        currentQuestionId: ++this.currentQuestionId,
        mode: Mode.TEACHER_DEMO_MODE
      };
      this.router.navigate(['/ranking'], { queryParams });
    }
  }
}
