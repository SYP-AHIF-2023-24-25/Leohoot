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
  quizLength = this.restservice.getQuizLength();
  currentQuestionId: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService) {

  }

  ngOnInit() {
    this.getParams();
    this.buildConnection();
  }

  buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5134/hub")
      .build();

    this.connection.start()
      .then(() => {
        this.connection.on("nextQuestion", () => {
          console.log("nextQuestion");
          const queryParams = {
            currentQuestionId: this.restservice.getNextQuestionId(this.currentQuestionId)
          };
          console.log(queryParams);
          this.router.navigate(['/studentMobileView'], { queryParams });
        })
      } )
      .catch(err => console.log('Error while establishing connection :('));
  }

  getParams() {
    this.route.queryParams.subscribe(params => {
      if (typeof params['currentQuestionId'] !== 'undefined') {
        console.log(params['currentQuestionId']);
        this.currentQuestionId = parseInt(params['currentQuestionId']);
      }
      this.buildConnection()
    });
  }
}
