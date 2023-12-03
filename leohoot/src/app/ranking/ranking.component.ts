import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as signalR from "@microsoft/signalr";
import { Mode } from 'src/model/mode';
import { User } from 'src/model/user';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent {
  currentQuestionId: number = 0;
  mode: number = 1;
  connection!: signalR.HubConnection;
  ranking: User[] = [];

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.getParams();
    this.buildConnection();
  }

  buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5134/hub")
    .build();

    this.connection.start()
    .then(() => {
      this.connection.send("sendRanking");
      this.connection.on("rankingReceived", (ranking) => {
        this.ranking = ranking as User[];
      });
    })
    .catch(err => console.log('Error while establishing connection :('));
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        this.currentQuestionId = params['currentQuestionId'];
      }
      if (typeof params['mode'] !== 'undefined') {
        this.mode = params['mode'];
      }
    });
  }

  nextQuestion() {
    console.log("nextQuestion");
    this.connection.send("sendToNextQuestion");
    const queryParams = {
      currentQuestionId: this.currentQuestionId,
      mode: Mode.GAME_MODE
    };
    this.router.navigate(['/question'], { queryParams });
  }
}
