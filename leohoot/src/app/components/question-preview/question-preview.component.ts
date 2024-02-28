import { Component } from '@angular/core';
import {Question} from "../../model/question";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../services/rest.service";
import {SignalRService} from "../../services/signalr.service";
import {Mode} from "../../model/mode";
import {Subscription, timer} from "rxjs";

@Component({
  selector: 'app-question-preview',
  standalone: true,
  imports: [],
  templateUrl: './question-preview.component.html'
})
export class QuestionPreviewComponent {
  question!: Question;
  questionNumber: number = 0;
  currTime: number = 0;
  obsTimer: Subscription = new Subscription();

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.questionNumber = parseInt(params['currentQuestionId']);
      }
      this.restservice.getQuestionByIdAllInfo(1, this.questionNumber).subscribe((data) => {
        this.question = data;
        this.question.previewTime = 5;
        this.startTimer();
      } );
    });
  }
  startTimer() {
    this.obsTimer = timer(0, 1000).subscribe((currTime) => {
      if (
        currTime == this.question.previewTime
      ) {
        this.obsTimer.unsubscribe();
        this.router.navigate(['/question'], { queryParams: { currentQuestionId: this.questionNumber, mode: Mode.GAME_MODE }});
      }
      this.currTime = currTime;
    });
  }
}
