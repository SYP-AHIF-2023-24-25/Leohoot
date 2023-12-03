import {Component, Input} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {Question} from "../../model/question";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../services/rest.service";
import {Answer} from "../../model/answer";
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
  selector: 'app-students-mobile-view',
  templateUrl: './students-mobile-view.component.html',
  styleUrls: ['./students-mobile-view.component.css']
})
export class StudentsMobileViewComponent {
  username: string = 'Sophie'
  connection!: signalR.HubConnection;
  questionIsFinished: boolean = false;
  quizLength = this.restservice.getQuizLength();
  currentQuestionId: number = 1;
  currentQuestionCount: number = 0;
  buttons: boolean[] = [false, false, false, false];
  colors = [
    'bg-button-yellow',
    'bg-red-500',
    'bg-green-400',
    'bg-button-blue',
  ];

  icons = [
    'assets/images/cat.png',
    'assets/images/crab.png',
    'assets/images/frog.png',
    'assets/images/bird.png'
  ]

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService) {
  }

  ngOnInit() {
    this.getParams();
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        console.log(params['currentQuestionId']);
        this.currentQuestionId = parseInt(params['currentQuestionId']);
      }
      this.buildConnection()
      this.getAnswerCountOfQuestion();
    });
  }

  buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5134/hub")
      .build();

    this.connection.start()
      .then(() => {
        this.connection.on("endLoading", () => {
          console.log("endLoading");
          this.router.navigate(['/studentMobileRanking'], { queryParams: { currentQuestionId: this.currentQuestionId } });
        });
      })
      .catch(err => console.log('Error while establishing connection :('));
  }

  getAnswerCountOfQuestion() {
    const response: number | undefined = this.restservice.getAnswerCountOfQuestion(this.currentQuestionId);
    console.log(response);
    if (typeof response === 'undefined') {
      this.router.navigate(['/studentMobileRanking'], { queryParams: { currentQuestionId: this.currentQuestionId } });
    } else {
      this.currentQuestionCount = response;
      this.generateButtons();
    }
  }

  generateButtons() {
    this.buttons = [];
    for (let i = 0; i < this.currentQuestionCount; i++) {
      this.buttons.push(false);
    }
  }

  addToAnswer(indexOfAnswer: number) {
    this.buttons[indexOfAnswer] = !this.buttons[indexOfAnswer];
  }

  confirmAnswers() {
    const areAnswersCorrect: boolean = this.restservice.areAnswersCorrect(this.currentQuestionId, this.buttons);
    if (areAnswersCorrect) {
      this.connection.send("confirmAnswer", this.username);
    }
    this.router.navigate(['/studentLoadingScreen'], { queryParams: { currentQuestionId: this.currentQuestionId } });
  }
}
