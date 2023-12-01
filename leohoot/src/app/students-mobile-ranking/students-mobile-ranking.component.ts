import {Component, Input} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {Question} from "../../model/question";
import {Answer} from "../../model/answer";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../services/rest.service";

@Component({
  selector: 'app-students-mobile-ranking',
  templateUrl: './students-mobile-ranking.component.html',
  styleUrls: ['./students-mobile-ranking.component.css']
})
export class StudentsMobileRankingComponent {
  connection!: signalR.HubConnection;
  @Input() currentQuestionId: number = 1;
  @Input() mode: number = 0;
  quizLength = this.restservice.getQuizLength();
  currentQuestion: Question = this.restservice.getQuestionById(1)!;
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
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5134/hub")
      .build();

    this.connection.start()
      .then(() => {
        console.log('Connection started!');
        this.connection.send("sendMessage", "Hello")
      } )
      .catch(err => console.log('Error while establishing connection :('));

    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.currentQuestionId = params['currentQuestionId'];
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
      const response: Question | undefined = this.restservice.getQuestionById(this.currentQuestionId);
      if (typeof response === 'undefined') {
        this.router.navigate(['/studentMobileRanking']);
      } else {
        this.currentQuestion = response;
      }
    });
  }

  nextQuestion() {
    this.currentQuestionId++;
    this.router.navigate(['/studentMobileView'], {queryParams: {currentQuestionId: this.currentQuestionId, mode: this.mode}});
  }
}
