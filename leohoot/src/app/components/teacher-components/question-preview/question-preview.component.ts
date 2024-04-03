import { Component } from '@angular/core';
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

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit() {
    this.getParams();
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
    this.obsTimer = timer(0, 1000).subscribe((currTime) => {
      if (
        currTime == this.question.previewTime
      ) {
        this.obsTimer.unsubscribe();
        this.signalRService.connection.send("sendToNextQuestion", this.gameId);
        this.router.navigate(['/question'], { queryParams: { gameId: this.gameId, mode: Mode.GAME_MODE }});
      }
      this.currTime = currTime;
    });
  }
}
