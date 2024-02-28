import { Component } from '@angular/core';
import {Question} from "../../model/question";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../services/rest.service";
import {SignalRService} from "../../services/signalr.service";
import {Quiz} from "../../model/quiz";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: []
})
export class GamesComponent {
  quizzes: Quiz[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit() {
    this.restservice.getAllQuizzes().subscribe((data) => {
      this.quizzes = data;
    });
  }
}
