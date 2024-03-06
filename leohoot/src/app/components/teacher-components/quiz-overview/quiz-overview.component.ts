import { Component } from '@angular/core';
import {QuestionTeacher} from "../../../model/question-teacher";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RestService} from "../../../services/rest.service";
import {SignalRService} from "../../../services/signalr.service";
import {Quiz} from "../../../model/quiz";

@Component({
  selector: 'app-games',
  templateUrl: './quiz-overview.component.html',
  styleUrls: []
})
export class QuizOverviewComponent {
  quizzes: Quiz[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private restservice: RestService, private signalRService: SignalRService) {

  }

  ngOnInit() {
    this.restservice.getAllQuizzes().subscribe((data) => {
      this.quizzes = data;
    });
  }

  goToWaitingroom(quizId: number) {
    this.router.navigate(['/waitingroom'], { queryParams: { quizId:  quizId} });
  }
}
