import {Component, Input} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {Question} from "../../model/question";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../services/rest.service";
import {Answer} from "../../model/answer";

@Component({
  selector: 'app-students-mobile-view',
  templateUrl: './students-mobile-view.component.html',
  styleUrls: ['./students-mobile-view.component.css']
})
export class StudentsMobileViewComponent {
  connection!: signalR.HubConnection;
  questionIsFinished: boolean = false;
  quizLength = this.restservice.getQuizLength();
  currentQuestionId: number = 1;
  currentQuestionCount: number = 0;
  buttonsSet: boolean[] = [false, false, false, false];
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
  pickedAnswer: Answer[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService) {
  }

  ngOnInit() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5134/hub")
      .build();

    this.connection.start()
      .then(() => {
        this.connection.on("currentQuestionIdReceived", (currentQuestionId: number) => {
          this.currentQuestionId = currentQuestionId;
          this.loadQuestion();
        });
      })
      .catch(err => console.log('Error while establishing connection :('));
  }

  loadQuestion() {
    const response: number | undefined = this.restservice.getAnswerCountOfQuestion(this.currentQuestionId);
      if (typeof response === 'undefined') {
        this.router.navigate(['/studentMobileRanking']);
      } else {
        this.currentQuestionCount = response;
        this.buttonsSet = [];
        for (let i = 0; i < this.currentQuestionCount; i++) {
          this.buttonsSet.push(false);
        }
      }
  }

  addToAnswer(indexOfAnswer: number) {
    this.buttonsSet[indexOfAnswer] = !this.buttonsSet[indexOfAnswer];
  }

  confirmAnswers() {
    this.connection.send("sendAnswer", this.buttonsSet);
  }


}
